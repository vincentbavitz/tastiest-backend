import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountService } from 'src/admin/account/account.service';
import { TrackingService } from 'src/tracking/tracking.service';
import { UserEntity } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [BookingsController],
  providers: [BookingsService, UsersService, TrackingService, AccountService],
})
export class BookingsModule {}
