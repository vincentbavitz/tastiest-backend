import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { RestaurantsModule } from 'src/restaurants/restaurants.module';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';

@Module({
  // imports: [HttpModule, RedisModule, RestaurantsModule, FirebaseModule],
  imports: [HttpModule, RestaurantsModule, FirebaseModule],
  controllers: [ReservationsController],
  providers: [PrismaService, ReservationsService],
  exports: [ReservationsService],
})
export class ReservationsModule {}
