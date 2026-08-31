import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { IngestionModule } from './ingestion/ingestion.module';
import { RequirementsModule } from './requirements/requirements.module';
import { EvidenceModule } from './evidence/evidence.module';

@Module({
  imports: [PrismaModule, IngestionModule, RequirementsModule, EvidenceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
