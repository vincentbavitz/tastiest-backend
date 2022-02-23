import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackingService } from 'src/tracking/tracking.service';
import { UsersModule } from 'src/users/users.module';
import { RestaurantProfileEntity } from './entities/restaurant-profile.entity';
import { RestaurantEntity } from './entities/restaurant.entity';
import RestaurateurApplicationEntity from './entities/restaurateur-application.entity';
import { RestaurantsController } from './restaurants.controller';
import { RestaurantsService } from './restaurants.service';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([
      RestaurantEntity,
      RestaurantProfileEntity,
      RestaurateurApplicationEntity,
    ]),
  ],
  controllers: [RestaurantsController],
  providers: [
    RestaurantsService,
    TrackingService,
    // EmailService,
    // EmailSchedulingService,
  ],
  exports: [RestaurantsService],
})
export class RestaurantsModule {}
