import { Controller, Post, Param, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { IngestionService } from './ingestion.service';

@Controller('tenders')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Post(':id/documents')
  @UseInterceptors(FileInterceptor('file'))
  async uploadTenderDocument(
    @Param('id') tenderId: string,
    @UploadedFile() file: any,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    if (file.mimetype !== 'application/pdf') {
      throw new BadRequestException('Only PDF files are currently supported');
    }

    const result = await this.ingestionService.ingestTenderDocument(
      tenderId,
      file.originalname,
      file.buffer,
      file.mimetype,
    );

    return {
      message: 'Document ingested successfully',
      ...result,
    };
  }
}
