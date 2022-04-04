import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { RequestWithUser } from 'src/auth/auth.model';
import { BookingsService } from './bookings.service';
import GetBookingsDto from './dto/get-bookings.dto';
import UpdateBookingDto from './dto/update-booking.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get('')
  getBookings(
    @Query() getBookingsDto: GetBookingsDto,
    @Request() request: RequestWithUser,
  ) {
    const { user_id, restaurant_id } = getBookingsDto;
    return this.bookingsService.getBookings(
      request.user,
      user_id,
      restaurant_id,
    );
  }

  @Get(':id')
  getBooking(@Param('id') id: string, @Request() request: RequestWithUser) {
    return this.bookingsService.getBooking(id, request.user);
  }

  @Post('update')
  updateBooking(
    @Body() data: UpdateBookingDto,
    @Request() request: RequestWithUser,
  ) {
    return this.bookingsService.updateBooking(data.booking_id, request.user, {
      hasArrived: data.has_arrived,
      hasCancelled: data.has_cancelled,
      bookedForTimestamp: data.booked_for_timestamp
        ? new Date(data.booked_for_timestamp).getTime()
        : undefined,
    });
  }
}
