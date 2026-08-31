import { Injectable, Inject, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LLM_PROVIDER, type LLMProvider } from '../ai/llm.provider';
import { DOCUMENT_PARSER, type DocumentParser } from '../ingestion/document-parser.interface';
import { STORAGE_PROVIDER, type StorageProvider } from '../storage/storage.provider';
import { z } from 'zod';
import { EVIDENCE_EXTRACTION_SYSTEM_PROMPT, getEvidenceExtractionUserPrompt } from '../prompts/evidence-extraction/v1';

const FactSchema = z.object({
  facts: z.array(z.object({
    category: z.enum(['FINANCIAL', 'EXPERIENCE', 'TECHNICAL', 'LEGAL', 'CERTIFICATION', 'DOCUMENTATION', 'TIMELINE', 'EMD', 'TURNOVER', 'OTHER']),
    metric: z.string(),
    value: z.record(z.string(), z.any()), // flexible JSON representation
    snippet: z.string(),
  })),
});

@Injectable()
export class EvidenceService {
  private readonly logger = new Logger(EvidenceService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(LLM_PROVIDER) private readonly llm: LLMProvider,
    @Inject(DOCUMENT_PARSER) private readonly parser: DocumentParser,
    @Inject(STORAGE_PROVIDER) private readonly storage: StorageProvider,
  ) {}

  async ingestCompanyDocument(companyProfileId: string, filename: string, buffer: Buffer, fileType: string) {
    // 1. Save document to storage
    const fileUrl = await this.storage.saveFile(filename, buffer);

    // 2. Parse document text and pages
    const parsedDoc = await this.parser.parse(buffer);

    // 3. Save document reference
    const document = await this.prisma.companyDocument.create({
      data: {
        companyProfileId,
        title: filename,
        fileUrl,
        fileType,
      },
    });

    const allFacts = [];

    // 4. Extract facts from each page
    for (const page of parsedDoc.pages) {
      if (!page.text || page.text.trim().length < 50) continue;

      try {
        const result = await this.llm.generateStructured({
          prompt: getEvidenceExtractionUserPrompt(page.text),
          system: EVIDENCE_EXTRACTION_SYSTEM_PROMPT,
          schema: FactSchema,
          schemaName: 'CompanyFacts',
        });

        // 5. Save extracted facts with provenance
        for (const fact of result.facts) {
          const savedFact = await this.prisma.extractedFact.create({
            data: {
              companyProfileId,
              documentId: document.id,
              category: fact.category,
              metric: fact.metric,
              value: fact.value,
              pageNumber: page.pageNumber,
              snippet: fact.snippet,
            },
          });
          allFacts.push(savedFact);
        }
      } catch (error) {
        this.logger.error(`Failed to extract facts for page ${page.pageNumber}`, error);
      }
    }

    return {
      documentId: document.id,
      fileUrl,
      factsExtracted: allFacts.length,
      facts: allFacts,
    };
  }
}
