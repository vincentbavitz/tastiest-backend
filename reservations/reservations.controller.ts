import { Controller, Get, Query } from '@nestjs/common';
import { ReservationsService } from 'reservations/reservations.service';

@Controller('reservations')
export class ReservationsController {
  constructor(private reservationsService: ReservationsService) {}

  /**
   * List the internal reservations of the restaurant.
   * Always sanitize for public routes; unsanitized data can be fetched
   * internally only
   */
  @Get('public/list')
  async getReservations(@Query('restaurant_id') restaurantId: string) {
    return this.reservationsService.getReservations(restaurantId, true);
  }
}
