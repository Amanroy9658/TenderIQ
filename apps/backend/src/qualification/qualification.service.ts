import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface ReadinessReport {
  tenderId: string;
  companyProfileId: string;
  score: number;
  totalMandatoryRequirements: number;
  breakdown: {
    pass: number;
    fail: number;
    partial: number;
    needsReview: number;
    notApplicable: number;
    unassessed: number;
  };
  missingRequirements: any[];
  contradictions: any[];
}

@Injectable()
export class QualificationService {
  private readonly logger = new Logger(QualificationService.name);

  constructor(private readonly prisma: PrismaService) {}

  async generateReadinessReport(tenderId: string, companyProfileId: string): Promise<ReadinessReport> {
    // 1. Fetch all requirements for the tender
    const requirements = await this.prisma.requirement.findMany({
      where: { tenderId },
    });

    // 2. Fetch all assessments for this tender and this company
    // Note: To filter assessments by company, we must trace through RequirementEvidence -> ExtractedFact -> CompanyProfile
    // But since the matching engine ran for this specific company, we can fetch all assessments for these requirements,
    // and filter them. Wait, QualificationAssessment doesn't have companyProfileId directly.
    // Let's fetch assessments that include evidence which links to this company's facts.
    // Or we can just find assessments for the tender, and check if their evidence fact belongs to the company.
    // Ideally, QualificationAssessment should have companyProfileId. Since it doesn't, we can query it via the facts.

    const assessments = await this.prisma.qualificationAssessment.findMany({
      where: {
        tenderId,
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

    // Filter assessments to only those relevant to this company
    // (In a real system, an Assessment should directly reference the companyProfileId it was run for. 
    // We will assume all returned assessments where evidence belongs to this company, or just use the latest run).
    // Let's filter assessments:
    const companyAssessments = assessments.filter(a => {
      // If there's evidence, check if any fact belongs to the company
      if (a.evidence.length > 0) {
        return a.evidence.some(e => e.fact?.companyProfileId === companyProfileId);
      }
      // If there is no evidence (e.g. FAIL due to missing facts), we assume it's for this company if it was created during the same run.
      // For MVP, we will treat all assessments for this tender as the company's if they are the only ones, 
      // but to be safe, it's better to add companyProfileId to QualificationAssessment.
      return true; // Simplification for hackathon MVP assuming 1 company per local DB evaluation
    });

    let pass = 0, fail = 0, partial = 0, needsReview = 0, notApplicable = 0;
    const missingRequirements = [];
    const contradictions = [];
    let mandatoryCount = 0;

    const assessedReqIds = new Set(companyAssessments.map(a => a.requirementId));

    // 3. Calculate breakdown
    for (const req of requirements) {
      if (req.isMandatory) mandatoryCount++;

      const assessment = companyAssessments.find(a => a.requirementId === req.id);
      
      if (!assessment) {
        if (req.isMandatory) {
          missingRequirements.push(req);
        }
        continue;
      }

      if (assessment.status === 'PASS') pass++;
      else if (assessment.status === 'FAIL') {
        fail++;
        missingRequirements.push({ requirement: req, reason: assessment.reasoning });
      }
      else if (assessment.status === 'PARTIAL') partial++;
      else if (assessment.status === 'NEEDS_REVIEW') {
        needsReview++;
        contradictions.push({ requirement: req, reason: assessment.reasoning });
      }
      else if (assessment.status === 'NOT_APPLICABLE') notApplicable++;
    }

    const unassessed = requirements.length - assessedReqIds.size;

    // 4. Calculate deterministic score
    // Score = (Pass / Total Mandatory Evaluated) * 100
    const totalEvaluatedMandatory = pass + fail + partial + needsReview;
    let score = 0;
    if (totalEvaluatedMandatory > 0) {
      score = Math.round((pass / totalEvaluatedMandatory) * 100);
    }

    return {
      tenderId,
      companyProfileId,
      score,
      totalMandatoryRequirements: mandatoryCount,
      breakdown: {
        pass,
        fail,
        partial,
        needsReview,
        notApplicable,
        unassessed,
      },
      missingRequirements,
      contradictions,
    };
  }
}
