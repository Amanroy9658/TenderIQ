import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { TendersService } from './tenders.service';
import { PrismaService } from '../prisma/prisma.service';

@Controller('tenders')
export class TendersController {
  constructor(
    private readonly tendersService: TendersService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  async getAllTenders() {
    return this.tendersService.getAllTenders();
  }

  @Get(':id')
  async getTender(@Param('id') id: string) {
    return this.prisma.tender.findUnique({
      where: { id },
      include: {
        requirements: true,
        assessments: {
          include: {
            recommendations: true,
            evidence: {
              include: { fact: true },
            }
          }
        },
      },
    });
  }

  @Post()
  async createTender(@Body() data: { title: string; description: string; deadline?: string }) {
    return this.prisma.tender.create({
      data: {
        title: data.title,
        description: data.description,
        deadline: data.deadline ? new Date(data.deadline) : null,
      },
    });
  }
}
