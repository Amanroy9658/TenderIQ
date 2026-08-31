import { Controller, Post, Param, Body } from '@nestjs/common';
import { MatchingService } from './matching.service';

@Controller('tenders')
export class MatchingController {
  constructor(private readonly matchingService: MatchingService) {}

  @Post(':tenderId/evaluate/:companyProfileId')
  async evaluateTender(
    @Param('tenderId') tenderId: string,
    @Param('companyProfileId') companyProfileId: string,
  ) {
    const result = await this.matchingService.evaluateTenderForCompany(tenderId, companyProfileId);
    return {
      message: 'Qualification assessment completed',
      ...result,
    };
  }
}
