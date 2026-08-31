import { Controller, Post, Param, UseInterceptors, UploadedFile, BadRequestException, Get } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { EvidenceService } from './evidence.service';
import { PrismaService } from '../prisma/prisma.service';
import 'multer';

@Controller('company-profiles')
export class EvidenceController {
  constructor(
    private readonly evidenceService: EvidenceService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  async getCompanyProfiles() {
    return this.prisma.companyProfile.findMany({
      include: {
        facts: true,
        documents: true,
      }
    });
  }

  @Post(':id/documents')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCompanyDocument(
    @Param('id') companyProfileId: string,
    @UploadedFile() file: any,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    if (file.mimetype !== 'application/pdf') {
      throw new BadRequestException('Only PDF files are currently supported');
    }

    const result = await this.evidenceService.ingestCompanyDocument(
      companyProfileId,
      file.originalname,
      file.buffer,
      file.mimetype,
    );

    return {
      message: 'Company evidence ingested successfully',
      result,
    };
  }
}
