import { Module } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';

@Module({
  controllers: [BookingsController],
  providers: [BookingsService, UsersService],
})
export class BookingsModule {}
