import {
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
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
    private readonly restaurantsService: RestaurantsService,
    private readonly emailSchedulingService: EmailSchedulingService,
  ) {}

  /**
   * Get the open times of a restaurant by their ID.
   * Include `restaurant_id` as a query parameter.
   */
  @Get('public/open-times')
  async getOpenTimes(@Query() getOpenTimesDto: GetOpenTimesDto) {
    return this.restaurantsService.getOpenTimes(getOpenTimesDto.restaurant_id);
  }

  @Post('set-open-times')
  @UseGuards(RoleGuard(UserRole.RESTAURANT))
  async setOpenTimes(
    @Query() setOpenTimesDto: SetOpenTimesDto,
    @Request() request: RequestWithUser,
  ) {
    return this.restaurantsService.setOpenTimes(
      setOpenTimesDto.restaurant_id,
      setOpenTimesDto.open_times,
      request.user,
    );
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
