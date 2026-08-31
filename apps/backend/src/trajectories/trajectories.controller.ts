import { Controller, Get, Param } from '@nestjs/common';
import { TrajectoriesService } from './trajectories.service';

@Controller('trajectories')
export class TrajectoriesController {
  constructor(private readonly trajectoriesService: TrajectoriesService) {}

  @Get('runs')
  async getAllRuns() {
    const runs = await this.trajectoriesService.getAllRuns();
    return {
      message: 'Fetched all agent runs',
      runs,
    };
  }

  @Get('runs/:runId')
  async getTrajectoriesByRunId(@Param('runId') runId: string) {
    const trajectories = await this.trajectoriesService.getTrajectoriesByRunId(runId);
    return {
      message: `Fetched trajectories for run ${runId}`,
      trajectories,
    };
  }
}
