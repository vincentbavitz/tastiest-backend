import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountService } from 'src/admin/account/account.service';
import { TrackingService } from 'src/tracking/tracking.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([UserEntity])],
  controllers: [BookingsController],
  providers: [BookingsService, TrackingService, AccountService],
})
export class BookingsModule {}
