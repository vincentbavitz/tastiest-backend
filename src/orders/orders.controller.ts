import { Body, Controller, Post } from '@nestjs/common';
import CreateOrderDto from './dto/create-order.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('new')
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
}
