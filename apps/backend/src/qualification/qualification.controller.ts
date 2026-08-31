import { Controller, Get, Param, Post } from '@nestjs/common';
import { QualificationService } from './qualification.service';

@Controller('tenders')
export class QualificationController {
  constructor(private readonly qualificationService: QualificationService) {}

  @Get(':tenderId/readiness/:companyProfileId')
  async getReadinessReport(
    @Param('tenderId') tenderId: string,
    @Param('companyProfileId') companyProfileId: string,
  ) {
    const report = await this.qualificationService.generateReadinessReport(tenderId, companyProfileId);
    return {
      message: 'Readiness report generated successfully',
      report,
    };
  }

  @Post(':tenderId/evaluate/:companyProfileId')
  async evaluateTender(
    @Param('tenderId') tenderId: string,
    @Param('companyProfileId') companyProfileId: string,
  ) {
    const assessments = await this.qualificationService.evaluateTender(tenderId, companyProfileId);
    return {
      message: 'Tender evaluated successfully',
      count: assessments.length,
      assessments,
    };
  }
}
