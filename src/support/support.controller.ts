import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from '@tastiest-io/tastiest-utils';
import { RequestWithUser } from 'src/auth/auth.model';
import RoleGuard from 'src/auth/role.guard';
import ReplyToTicketDto from './dto/reply-to-ticket.dto';
import UpdateUserTicketDto from './dto/update-user-ticket.dto';
import { SupportService } from './support.service';

/**
 * Support functionality for users, restaurants and admin.
 *
 *
 * Note that for all routes, the support type is implied
 * from the Bearer token.
 *
 * @example `USER_TO_SUPPORT` is when the user role is `eater`.
 * @example `SUPPORT_TO_USER` is when the user role is `admin`.
 * @example `SUPPORT_TO_RESTAURANT` is when the user role is `admin`
 * @example `RESTAURANT_TO_SUPPORT` is when the user role is `restaurant`
 */
@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Get('users')
  getUserTickets(@Request() request: RequestWithUser) {
    return this.supportService.getUserTickets(request.user);
  }

  @Get('restaurants')
  getRestaurantTickets(@Request() request: RequestWithUser) {
    return this.supportService.getRestaurantTickets(request.user);
  }

  @Get('users/ticket/:id')
  getUserTicket(@Param('id') id: string, @Request() request: RequestWithUser) {
    return this.supportService.getTicket(id, 'user', request.user);
  }

  @Get('restaurants/ticket/:id')
  getRestaurantTicket(
    @Param('id') id: string,
    @Request() request: RequestWithUser,
  ) {
    return this.supportService.getTicket(id, 'restaurant', request.user);
  }

  @Post('updateTicket')
  updateTicket(@Body() data: UpdateUserTicketDto) {
    return this.supportService.updateTicket(data);
  }

  @UseGuards(RoleGuard(UserRole.ADMIN))
  @Post('closeTicket')
  closeTicket() {
    return this.supportService.closeTicket();
  }

  @UseGuards(RoleGuard(UserRole.EATER))
  @Post('users/reply')
  replyToUserTicket(
    @Body() replyToTicketDto: ReplyToTicketDto,
    @Request() request: RequestWithUser,
  ) {
    return this.supportService.replyToTicket(
      replyToTicketDto.id,
      'user',
      request.user,
      replyToTicketDto.message,
      replyToTicketDto.name,
    );
  }

  @UseGuards(RoleGuard(UserRole.RESTAURANT))
  @Post('restaurants/reply')
  replyToRestaurantTicket(
    @Body() replyToTicketDto: ReplyToTicketDto,
    @Request() request: RequestWithUser,
  ) {
    return this.supportService.replyToTicket(
      replyToTicketDto.id,
      'restaurant',
      request.user,
      replyToTicketDto.message,
      replyToTicketDto.name,
    );
  }
}
