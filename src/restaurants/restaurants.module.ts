import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import EmailService from 'src/email/email.service';
import EmailSchedulingService from 'src/email/schedule/email-schedule.service';
import { TrackingService } from 'src/tracking/tracking.service';
import { UsersModule } from 'src/users/users.module';
import { RestaurantEntity } from './entities/restaurant.entity';
import RestaurateurApplicationEntity from './entities/restaurateur-application.entity';
import { RestaurantsController } from './restaurants.controller';
import { RestaurantsService } from './restaurants.service';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([RestaurantEntity, RestaurateurApplicationEntity]),
  ],
  controllers: [RestaurantsController],
  providers: [
    RestaurantsService,
    TrackingService,
    EmailService,
    EmailSchedulingService,
  ],
  exports: [RestaurantsService],
})
export class RestaurantsModule {}
