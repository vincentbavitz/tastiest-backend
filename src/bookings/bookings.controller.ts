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

  @Get()
  getBookings(
    @Query() getBookingsDto: GetBookingsDto,
    @Request() request: RequestWithUser,
  ) {
    const { userId, restaurantId } = getBookingsDto;
    return this.bookingsService.getBookings(request.user, userId, restaurantId);
  }

  @Get(':id')
  getBooking(@Param('id') id: string, @Request() request: RequestWithUser) {
    return this.bookingsService.getBooking(id, request.user);
  }

  @Post('update')
  updateBooking(
    @Body() updateBookingDto: UpdateBookingDto,
    @Request() request: RequestWithUser,
  ) {
    // return this.bookingsService.updateBooking(
    //   updateBookingDto.bookingId,
    //   request.user,
    //   {
    //     ...updateBookingDto,
    //   },
    // );
    return null;
  }
}
