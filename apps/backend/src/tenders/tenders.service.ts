import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TendersService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllTenders() {
    return this.prisma.tender.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        organization: true,
      },
    });
  }

  async getTenderById(id: string) {
    return this.prisma.tender.findUnique({
      where: { id },
      include: {
        requirements: true,
        assessments: {
          include: {
            requirement: true,
            recommendations: true,
          }
        }
      }
    });
  }
}
