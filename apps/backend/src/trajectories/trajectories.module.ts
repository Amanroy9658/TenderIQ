import { Module } from '@nestjs/common';
import { TrajectoriesService } from './trajectories.service';
import { TrajectoriesController } from './trajectories.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TrajectoriesController],
  providers: [TrajectoriesService],
  exports: [TrajectoriesService],
})
export class TrajectoriesModule {}
