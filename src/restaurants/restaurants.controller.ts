import { Body, Controller, Post } from '@nestjs/common';
import EmailSchedulingService from 'src/email/schedule/email-schedule.service';
import ApplyDto from './dto/apply.dto';
import NotifyDto from './dto/notify.dto';
import { RestaurantsService } from './restaurants.service';

@Controller('restaurants')
export class RestaurantsController {
  constructor(
    private readonly restaurantsService: RestaurantsService,
    private readonly emailSchedulingService: EmailSchedulingService,
  ) {}

  @Post('notify')
  async notify(@Body() notifyData: NotifyDto) {
    return this.restaurantsService.scheduleFollowersEmail(notifyData);
  }

  /** The application form coming from tastiest.io/restaurateurs */
  @Post('public/apply')
  async apply(@Body() applyData: ApplyDto) {
    return this.restaurantsService.applyAsRestaurateur(applyData);
  }
}
