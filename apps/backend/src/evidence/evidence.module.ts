import { Module } from '@nestjs/common';
import { EvidenceService } from './evidence.service';
import { EvidenceController } from './evidence.controller';
import { AiModule } from '../ai/ai.module';
import { IngestionModule } from '../ingestion/ingestion.module';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [AiModule, IngestionModule, StorageModule],
  controllers: [EvidenceController],
  providers: [EvidenceService],
  exports: [EvidenceService],
})
export class EvidenceModule {}
