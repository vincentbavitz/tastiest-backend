import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { FirebaseService } from 'src/firebase/firebase.service';

@Injectable()
export class TasksService {
  private schedulerRegistry: SchedulerRegistry;
  private readonly logger = new Logger(TasksService.name);

  constructor(private firebaseApp: FirebaseService) {}

  @Cron(CronExpression.EVERY_30_SECONDS)
  async updateRestaurants() {
    this.logger.log('sdf');
  }
}
