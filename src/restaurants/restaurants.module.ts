import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import EmailService from 'src/email/email.service';
import EmailSchedulingService from 'src/email/schedule/email-schedule.service';
import RestaurateurApplicationEntity from 'src/entities/restaurateur-application.entity';
import { TrackingService } from 'src/tracking/tracking.service';
import { RestaurantsController } from './restaurants.controller';
import { RestaurantsService } from './restaurants.service';

@Module({
  imports: [TypeOrmModule.forFeature([RestaurateurApplicationEntity])],
  controllers: [RestaurantsController],
  providers: [
    RestaurantsService,
    TrackingService,
    EmailService,
    EmailSchedulingService,
  ],
})
export class RestaurantsModule {}
