import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UserRole } from '@tastiest-io/tastiest-utils';
import RoleGuard from 'src/auth/role.guard';
import CreateOrderDto from './dto/create-order.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('new')
  @UseGuards(RoleGuard(UserRole.EATER))
  createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.createOrder(
      createOrderDto.dealId,
      createOrderDto.heads,
      createOrderDto.fromSlug,
      createOrderDto.bookedForTimestamp,
      {
        userId: createOrderDto.userId ?? null,
        anonymousId: createOrderDto.anonymousId ?? null,
        promoCode: createOrderDto.promoCode ?? null,
        userAgent: createOrderDto.userAgent ?? null,
      },
    );
  }

  @UseGuards(RoleGuard(UserRole.EATER, UserRole.ADMIN))
  updateOrder(@Body() updateOrderDto: any) {
    updateOrderDto;
    return null;
  }
}
