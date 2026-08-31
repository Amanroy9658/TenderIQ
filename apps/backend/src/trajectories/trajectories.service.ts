import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TrajectoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async getTrajectoriesByRunId(runId: string) {
    return this.prisma.agentTrajectory.findMany({
      where: { runId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async getAllRuns() {
    // Get unique runIds (requires raw query or grouping)
    // For simplicity, we can just return all trajectories ordered by creation date, 
    // or group them by runId in the controller.
    const distinctRuns = await this.prisma.agentTrajectory.findMany({
      select: {
        runId: true,
        agentName: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      distinct: ['runId'],
    });
    
    return distinctRuns;
  }
}
