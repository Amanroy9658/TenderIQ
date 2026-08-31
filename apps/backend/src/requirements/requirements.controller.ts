import { Controller, Post, Param } from '@nestjs/common';
import { RequirementsService } from './requirements.service';

@Controller('tenders')
export class RequirementsController {
  constructor(private readonly requirementsService: RequirementsService) {}

  @Post(':id/extract-requirements')
  async extractRequirements(@Param('id') tenderId: string) {
    const requirements = await this.requirementsService.extractRequirementsForTender(tenderId);
    return {
      message: 'Requirements extraction completed',
      extractedCount: requirements.length,
      requirements,
    };
  }
}
