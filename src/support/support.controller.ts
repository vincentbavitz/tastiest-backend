import { Body, Controller, Post } from '@nestjs/common';
import UpdateRestaurantTicketDto from './dto/update-restaurant-ticket.dto';
import UpdateUserTicketDto from './dto/update-user-ticket.dto';
import { SupportService } from './support.service';

@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Post('restaurants/updateTicket')
  updateRestaurantTicket(@Body() data: UpdateRestaurantTicketDto) {
    return this.supportService.updateRestaurantTicket(data);
  }

  @Post('users/updateTicket')
  updateUserTicket(@Body() data: UpdateUserTicketDto) {
    return this.supportService.updateUserTicket(data);
  }
}
