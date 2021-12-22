import { Module } from '@nestjs/common';
import EmailService from 'src/email/email.service';
import EmailSchedulingService from 'src/email/schedule/email-schedule.service';
import { RestaurantsController } from './restaurants.controller';
import { RestaurantsService } from './restaurants.service';

@Module({
  controllers: [RestaurantsController],
  providers: [RestaurantsService, EmailService, EmailSchedulingService],
})
export class RestaurantsModule {}
