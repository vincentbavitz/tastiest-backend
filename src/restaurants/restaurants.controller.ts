import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { DayOfWeek, TimeRange } from '@tastiest-io/tastiest-horus';
import { UserRole } from '@tastiest-io/tastiest-utils';
import { RequestWithUser } from 'src/auth/auth.model';
import RoleGuard from 'src/auth/role.guard';
import EmailSchedulingService from 'src/email/schedule/email-schedule.service';
import GetOpenTimesDto from './dto/get-open-times.dto';
import SetOpenTimesDto from './dto/set-open-times.dto';
import { RestaurantsService } from './restaurants.service';

@Controller('restaurants')
export class RestaurantsController {
  constructor(
    private restaurantsService: RestaurantsService,
    private emailSchedulingService: EmailSchedulingService,
  ) {}

  /**
   * Get the open times of a restaurant by their ID.
   * Include `restaurant_id` as a query parameter.
   */
  @Get('public/open-times')
  async getOpenTimes(@Query() getOpenTimesDto: GetOpenTimesDto) {
    return this.restaurantsService.getOpenTimes(getOpenTimesDto.restaurant_id);
  }

  /**
   * Stripe Webhook: Restaurant Connected Acconut created or updated.
   */
  @Post('public/connect-account-webhook')
  async updateConnectAccount(@Body() body: any) {
    return this.restaurantsService.updateConnectAccount(body);
  }

  /**
   * Get the restaurant of the token making the request.
   */
  @Get('me')
  async getUserFromToken(@Request() request: RequestWithUser) {
    return this.restaurantsService.getRestaurant(request.user.uid);
  }

  /**
   * If day is given in DTO as [0, 0] (or any negatives for both 0 and 1), is it marked as closed.
   * Eg: `{ monday: [0, 0] }` is closed,
   */
  @Post('set-open-times')
  @UseGuards(RoleGuard(UserRole.RESTAURANT))
  async setOpenTimes(
    @Body() data: SetOpenTimesDto,
    @Request() request: RequestWithUser,
  ) {
    const dayToMetricDay = (range: TimeRange) => ({
      open: range[0] > 0 && range[1] > 0,
      range,
    });

    return this.restaurantsService.setOpenTimes(
      data.restaurant_id,
      {
        [DayOfWeek.MONDAY]: dayToMetricDay(data[DayOfWeek.MONDAY]),
        [DayOfWeek.TUESDAY]: dayToMetricDay(data[DayOfWeek.TUESDAY]),
        [DayOfWeek.WEDNESDAY]: dayToMetricDay(data[DayOfWeek.WEDNESDAY]),
        [DayOfWeek.THURSDAY]: dayToMetricDay(data[DayOfWeek.THURSDAY]),
        [DayOfWeek.FRIDAY]: dayToMetricDay(data[DayOfWeek.FRIDAY]),
        [DayOfWeek.SATURDAY]: dayToMetricDay(data[DayOfWeek.SATURDAY]),
        [DayOfWeek.SUNDAY]: dayToMetricDay(data[DayOfWeek.SUNDAY]),
      },
      request.user,
    );
  }

  /**
   * Gets restaurant's Stripe Connect Account balances
   */
  @Get('get-balances')
  @UseGuards(RoleGuard(UserRole.RESTAURANT))
  async getBalances(@Request() request: RequestWithUser) {
    return this.restaurantsService.getBalances(request.user.uid);
  }

  // @Post('notify')
  // async notify(@Body() notifyData: NotifyDto) {
  //   return this.restaurantsService.scheduleFollowersEmail(notifyData);
  // }

  // /** The application form coming from tastiest.io/restaurateurs */
  // @Post('public/apply')
  // async apply(
  //   @Body() applyData: ApplyDto,
  //   @Request() request: RequestWithUser,
  // ) {
  //   return this.restaurantsService.applyAsRestaurateur(applyData, request.user);
  // }
}
