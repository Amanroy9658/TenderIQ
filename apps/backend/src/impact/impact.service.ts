import { Injectable, Inject, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LLM_PROVIDER, type LLMProvider } from '../ai/llm.provider';
import { z } from 'zod';
import { IMPACT_ANALYSIS_SYSTEM_PROMPT, getImpactAnalysisUserPrompt } from '../prompts/impact-analysis/v1';

const RecommendationSchema = z.object({
  actionText: z.string(),
  potentialStatus: z.string(),
});

@Injectable()
export class ImpactService {
  private readonly logger = new Logger(ImpactService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(LLM_PROVIDER) private readonly llm: LLMProvider,
  ) {}

  async generateRecommendations(tenderId: string, companyProfileId: string) {
    // 1. Fetch assessments that are NOT PASS and NOT NOT_APPLICABLE
    const assessments = await this.prisma.qualificationAssessment.findMany({
      where: {
        tenderId,
        status: { in: ['FAIL', 'PARTIAL', 'NEEDS_REVIEW'] },
      },
      include: {
        requirement: true,
        recommendations: true,
        evidence: { include: { fact: true } },
      },
    });

    // Note: Like qualification.service, we should ensure the assessment belongs to the company,
    // but we assume local evaluation isolation for MVP.

    const newRecommendations = [];

    // 2. Generate recommendations for each failing/partial assessment
    for (const assessment of assessments) {
      // Skip if already has a recommendation
      if (assessment.recommendations.length > 0) continue;

      try {
        const result = await this.llm.generateStructured({
          prompt: getImpactAnalysisUserPrompt(assessment.requirement, assessment),
          system: IMPACT_ANALYSIS_SYSTEM_PROMPT,
          schema: RecommendationSchema,
          schemaName: 'ActionableRecommendation',
        });

        const savedRec = await this.prisma.recommendation.create({
          data: {
            assessmentId: assessment.id,
            actionText: result.actionText,
            potentialStatus: result.potentialStatus || 'PASS',
          },
        });

        newRecommendations.push(savedRec);
      } catch (error) {
        this.logger.error(`Failed to generate recommendation for assessment ${assessment.id}`, error);
      }
    }

    return {
      message: 'Recommendations generated successfully',
      generatedCount: newRecommendations.length,
      recommendations: newRecommendations,
    };
  }
}
