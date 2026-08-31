import { Module } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { PdfDocumentParser } from './pdf-parser.service';
import { DOCUMENT_PARSER } from './document-parser.interface';
import { StorageModule } from '../storage/storage.module';
import { IngestionController } from './ingestion.controller';

@Module({
  imports: [StorageModule],
  controllers: [IngestionController],
  providers: [
    IngestionService,
    {
      provide: DOCUMENT_PARSER,
      useClass: PdfDocumentParser,
    },
  ],
  exports: [IngestionService],
})
export class IngestionModule {}
