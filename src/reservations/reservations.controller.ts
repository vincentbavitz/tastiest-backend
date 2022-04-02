import {
  Controller,
  Get,
  Query,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from '@tastiest-io/tastiest-utils';
import { RequestWithUser } from 'src/auth/auth.model';
import RoleGuard from 'src/auth/role.guard';
import { ReservationsService } from 'src/reservations/reservations.service';
import GetOpenSlotsDto from './dto/get-open-slots.dto';
import GetReservationsDto from './dto/get-reservations.dto';

@Controller('reservations')
export class ReservationsController {
  constructor(private reservationsService: ReservationsService) {}

  /**
   * Get the open reservation slots for a restaurant.
   * This information is public and is consumed by the
   * front-end at `tastiest.io/london/[cuisine]/[restaurant]/[slug]`.
   */
  @Get('public/open-slots')
  async getOpenSlots(
    @Query() { restaurant_id: restaurantId, timezone }: GetOpenSlotsDto,
  ) {
    return this.reservationsService.getOpenSlots(restaurantId, timezone);
  }

  /**
   * List the internal reservations of the restaurant.
   * This route is only accessible to the restaurant owner and admins.
   */
  @UseGuards(RoleGuard(UserRole.RESTAURANT))
  @Get('list')
  async getReservations(
    @Query() { restaurant_id: restaurantId }: GetReservationsDto,
    @Request() request: RequestWithUser,
  ) {
    if (
      !request.user.roles.includes(UserRole.ADMIN) &&
      request.user.uid !== restaurantId
    ) {
      throw new UnauthorizedException();
    }

    return this.reservationsService.getReservations(restaurantId, true);
  }
}
