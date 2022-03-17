import { Module } from '@nestjs/common';
import { AccountService } from 'src/admin/account/account.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { TrackingService } from 'src/tracking/tracking.service';
import { UsersModule } from 'src/users/users.module';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';

@Module({
  imports: [UsersModule],
  controllers: [BookingsController],
  providers: [BookingsService, TrackingService, AccountService, PrismaService],
})
export class BookingsModule {}
