import { Controller, Get, Param, Post, Body, NotFoundException } from '@nestjs/common';
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
    const tender = await this.prisma.tender.findUnique({
      where: { id },
      include: {
        documents: true,
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
    
    if (!tender) {
      throw new NotFoundException('Tender not found');
    }
    
    return tender;
  }

  @Post()
  async createTender(@Body() data: { title: string; description: string; deadline?: string }) {
    const org = await this.prisma.organization.findFirst();
    
    if (!org) {
      throw new Error("No organization found to attach this tender to.");
    }
    
    return this.prisma.tender.create({
      data: {
        title: data.title,
        description: data.description,
        deadline: data.deadline ? new Date(data.deadline) : null,
        status: 'OPEN',
        organization: { connect: { id: org.id } },
      },
    });
  }
}
