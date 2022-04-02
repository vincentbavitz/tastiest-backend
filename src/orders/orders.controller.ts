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
import CreateOrderDto from './dto/create-order.dto';
import UserUpdateOrderDto from './dto/user-update-order.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('new')
  @UseGuards(RoleGuard(UserRole.EATER))
  async createOrder(
    @Body() data: CreateOrderDto,
    @Request() request: RequestWithUser,
  ) {
    const order = await this.ordersService.createOrder(
      data.product_id,
      request.user.uid,
      data.heads,
      data.booked_for_timestamp,
      {
        promoCode: data.promo_code ?? null,
        userAgent: data.user_agent ?? null,
      },
    );

    return {
      ...order,
      // These properties are admin-only
      id: this.isAdmin(request) ? order.id : null,
    };
  }

  /** Get a single order from an order token */
  @Get(':token')
  @UseGuards(RoleGuard(UserRole.EATER))
  async getOrder(
    @Param('token') token: string,
    @Request() request: RequestWithUser,
  ) {
    const order = await this.ordersService.getOrder(token, request.user);

    return {
      ...order,
      // These properties are admin-Only
      id: this.isAdmin(request) ? order.id : null,
    };
  }

  @Post('update')
  @UseGuards(RoleGuard(UserRole.EATER))
  userUpdateOrder(
    @Body() data: UserUpdateOrderDto,
    @Request() request: RequestWithUser,
  ) {
    return this.ordersService.userUpdateOrder(data.token, request.user, {
      payment_method: data.payment_method,
    });
  }

  private isAdmin(request: RequestWithUser): boolean {
    return request.user.roles.includes(UserRole.ADMIN);
  }
}
