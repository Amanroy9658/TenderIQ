import { Controller, Get, Param, Patch, Body } from '@nestjs/common';
import { VerificationService, ResolveAssessmentDto } from './verification.service';

@Controller('verification')
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @Get('tenders/:tenderId/needs-review')
  async getNeedsReview(@Param('tenderId') tenderId: string) {
    const assessments = await this.verificationService.getAssessmentsNeedingReview(tenderId);
    return {
      message: 'Fetched assessments needing review',
      count: assessments.length,
      assessments,
    };
  }

  @Patch('assessments/:id/resolve')
  async resolveAssessment(
    @Param('id') assessmentId: string,
    @Body() resolveDto: ResolveAssessmentDto,
  ) {
    const updated = await this.verificationService.resolveAssessment(assessmentId, resolveDto);
    return {
      message: 'Assessment resolved successfully',
      assessment: updated,
    };
  }
}
