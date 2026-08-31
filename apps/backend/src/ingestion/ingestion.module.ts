import { Module } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { PdfDocumentParser } from './pdf-parser.service';
import { DOCUMENT_PARSER } from './document-parser.interface';
import { StorageModule } from '../storage/storage.module';
import { IngestionController } from './ingestion.controller';
import { RequirementsModule } from '../requirements/requirements.module';

@Module({
  imports: [StorageModule, RequirementsModule],
  controllers: [IngestionController],
  providers: [
    IngestionService,
    {
      provide: DOCUMENT_PARSER,
      useClass: PdfDocumentParser,
    },
  ],
  exports: [IngestionService, DOCUMENT_PARSER],
})
export class IngestionModule {}
