import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { IngestionModule } from './ingestion/ingestion.module';
import { RequirementsModule } from './requirements/requirements.module';
import { EvidenceModule } from './evidence/evidence.module';
import { MatchingModule } from './matching/matching.module';
import { QualificationModule } from './qualification/qualification.module';
import { VerificationModule } from './verification/verification.module';
import { ImpactModule } from './impact/impact.module';
import { TendersModule } from './tenders/tenders.module';
import { TrajectoriesModule } from './trajectories/trajectories.module';

@Module({
  imports: [
    PrismaModule,
    IngestionModule,
    RequirementsModule,
    EvidenceModule,
    MatchingModule,
    QualificationModule,
    VerificationModule,
    ImpactModule,
    TendersModule,
    TrajectoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
