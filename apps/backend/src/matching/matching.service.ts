import { Injectable, Inject, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LLM_PROVIDER, type LLMProvider } from '../ai/llm.provider';
import { z } from 'zod';
import { MATCHING_SYSTEM_PROMPT, getMatchingUserPrompt } from '../prompts/matching/v1';

const AssessmentSchema = z.object({
  status: z.enum(['PASS', 'FAIL', 'PARTIAL', 'NEEDS_REVIEW', 'NOT_APPLICABLE']),
  reasoning: z.string(),
  confidence: z.number().min(0).max(1),
  usedFactIds: z.array(z.string()),
  justification: z.string(),
});

@Injectable()
export class MatchingService {
  private readonly logger = new Logger(MatchingService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(LLM_PROVIDER) private readonly llm: LLMProvider,
  ) {}

  async evaluateTenderForCompany(tenderId: string, companyProfileId: string) {
    // 1. Fetch Requirements
    const requirements = await this.prisma.requirement.findMany({
      where: { tenderId },
    });

    // 2. Fetch Company Facts
    const facts = await this.prisma.extractedFact.findMany({
      where: { companyProfileId },
    });

    const assessments = [];

    // 3. Evaluate each requirement
    for (const req of requirements) {
      try {
        const result = await this.llm.generateStructured({
          prompt: getMatchingUserPrompt(req, facts),
          system: MATCHING_SYSTEM_PROMPT,
          schema: AssessmentSchema,
          schemaName: 'RequirementAssessment',
        });

        // 4. Save the assessment
        const assessment = await this.prisma.qualificationAssessment.create({
          data: {
            tenderId,
            requirementId: req.id,
            status: result.status,
            reasoning: result.reasoning,
            confidence: result.confidence,
            evidence: {
              create: result.usedFactIds.map((factId) => ({
                factId,
                justification: result.justification,
              })),
            },
          },
          include: { evidence: true },
        });

        assessments.push(assessment);
      } catch (error) {
        this.logger.error(`Failed to evaluate requirement ${req.id}`, error);
        
        // Fallback for failed assessments
        const fallback = await this.prisma.qualificationAssessment.create({
          data: {
            tenderId,
            requirementId: req.id,
            status: 'NEEDS_REVIEW',
            reasoning: 'LLM evaluation failed or threw an error.',
            confidence: 0.0,
          },
        });
        assessments.push(fallback);
      }
    }

    return {
      tenderId,
      companyProfileId,
      totalRequirements: requirements.length,
      assessments,
    };
  }
}
