import { Injectable, Inject, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LLM_PROVIDER, LLMProvider } from '../ai/llm.provider';
import { z } from 'zod';
import { REQUIREMENT_EXTRACTION_SYSTEM_PROMPT, getRequirementExtractionUserPrompt } from '../prompts/requirement-extraction/v1';

const RequirementSchema = z.object({
  requirements: z.array(z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['FINANCIAL', 'EXPERIENCE', 'TECHNICAL', 'LEGAL', 'CERTIFICATION', 'DOCUMENTATION', 'TIMELINE', 'EMD', 'TURNOVER', 'OTHER']),
    metric: z.string().optional(),
    operator: z.enum(['>=', '<=', '==']).optional(),
    threshold: z.number().optional(),
    currency: z.string().optional(),
    unit: z.string().optional(),
    period: z.string().optional(),
    isMandatory: z.boolean().default(true),
    ambiguity: z.string().optional(),
  })),
});

@Injectable()
export class RequirementsService {
  private readonly logger = new Logger(RequirementsService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(LLM_PROVIDER) private readonly llm: LLMProvider,
  ) {}

  async extractRequirementsForTender(tenderId: string) {
    // 1. Get all sections for the tender
    const documents = await this.prisma.tenderDocument.findMany({
      where: { tenderId },
      include: { sections: true },
    });

    const allRequirements = [];

    // 2. Iterate through sections (pages) and extract requirements
    for (const doc of documents) {
      for (const section of doc.sections) {
        if (!section.content || section.content.trim().length < 50) {
          continue; // Skip empty or very short pages
        }

        try {
          const result = await this.llm.generateStructured({
            prompt: getRequirementExtractionUserPrompt(section.content),
            system: REQUIREMENT_EXTRACTION_SYSTEM_PROMPT,
            schema: RequirementSchema,
            schemaName: 'TenderRequirements',
          });

          // 3. Save extracted requirements to DB, preserving provenance
          for (const req of result.requirements) {
            const savedReq = await this.prisma.requirement.create({
              data: {
                tenderId,
                title: req.title,
                description: req.description,
                category: req.category,
                metric: req.metric,
                operator: req.operator,
                threshold: req.threshold,
                currency: req.currency,
                unit: req.unit,
                period: req.period,
                isMandatory: req.isMandatory,
                ambiguity: req.ambiguity,
                sourceDocumentId: doc.id,
                sourcePage: section.pageNumber,
              },
            });
            allRequirements.push(savedReq);
          }
        } catch (error) {
          this.logger.error(`Failed to extract requirements for section ${section.id}`, error);
        }
      }
    }

    return allRequirements;
  }
}
