import { Controller, Get, Param } from '@nestjs/common';
import { TendersService } from './tenders.service';

@Controller('tenders')
export class TendersController {
  constructor(private readonly tendersService: TendersService) {}

  @Get()
  async getAllTenders() {
    return this.tendersService.getAllTenders();
  }

  @Get(':id')
  async getTenderById(@Param('id') id: string) {
    return this.tendersService.getTenderById(id);
  }
}
