import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface ResolveAssessmentDto {
  status: 'PASS' | 'FAIL' | 'PARTIAL' | 'NOT_APPLICABLE';
  reasoning: string;
}

@Injectable()
export class VerificationService {
  constructor(private readonly prisma: PrismaService) {}

  async getAssessmentsNeedingReview(tenderId: string) {
    return this.prisma.qualificationAssessment.findMany({
      where: {
        tenderId,
        status: 'NEEDS_REVIEW',
        isVerified: false,
      },
      include: {
        requirement: true,
        evidence: {
          include: {
            fact: true,
          },
        },
      },
    });
  }

  async resolveAssessment(assessmentId: string, data: ResolveAssessmentDto) {
    const assessment = await this.prisma.qualificationAssessment.findUnique({
      where: { id: assessmentId },
    });

    if (!assessment) {
      throw new NotFoundException('Assessment not found');
    }

    return this.prisma.qualificationAssessment.update({
      where: { id: assessmentId },
      data: {
        status: data.status,
        reasoning: `[HUMAN OVERRIDE] ${data.reasoning}`,
        isVerified: true,
      },
    });
  }
}
