import { Controller, Post, Param } from '@nestjs/common';
import { ImpactService } from './impact.service';

@Controller('impact')
export class ImpactController {
  constructor(private readonly impactService: ImpactService) {}

  @Post('tenders/:tenderId/recommend/:companyProfileId')
  async generateImpactRecommendations(
    @Param('tenderId') tenderId: string,
    @Param('companyProfileId') companyProfileId: string,
  ) {
    return this.impactService.generateRecommendations(tenderId, companyProfileId);
  }
}
