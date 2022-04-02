import { Module } from '@nestjs/common';
import { AccountModule } from 'src/admin/account/account.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { TrackingService } from 'src/tracking/tracking.service';
import { UsersModule } from 'src/users/users.module';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';

@Module({
  imports: [UsersModule, AccountModule],
  controllers: [BookingsController],
  providers: [BookingsService, TrackingService, PrismaService],
  exports: [BookingsService],
})
export class BookingsModule {}
