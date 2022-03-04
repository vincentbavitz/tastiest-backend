import { Module } from '@nestjs/common';
import EmailService from 'src/email/email.service';
import EmailSchedulingService from 'src/email/schedule/email-schedule.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { TrackingService } from 'src/tracking/tracking.service';
import { UsersModule } from 'src/users/users.module';
import { RestaurantsController } from './restaurants.controller';
import { RestaurantsService } from './restaurants.service';

@Module({
  imports: [UsersModule],
  controllers: [RestaurantsController],
  providers: [
    PrismaService,
    RestaurantsService,
    TrackingService,
    EmailService,
    EmailSchedulingService,
  ],
  exports: [RestaurantsService],
})
export class RestaurantsModule {}
