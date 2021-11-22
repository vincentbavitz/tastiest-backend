import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  private schedulerRegistry: SchedulerRegistry;
  private readonly logger = new Logger(TasksService.name);

  @Cron(CronExpression.EVERY_30_SECONDS)
  updateRestaurants() {
    this.logger.log('sdf');
  }
}
