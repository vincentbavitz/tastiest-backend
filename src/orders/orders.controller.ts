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
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('new')
  @UseGuards(RoleGuard(UserRole.EATER))
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @Request() request: RequestWithUser,
  ) {
    const order = await this.ordersService.createOrder(
      createOrderDto.productId,
      request.user.uid,
      createOrderDto.heads,
      createOrderDto.bookedForTimestamp,
      {
        promoCode: createOrderDto.promoCode ?? null,
        userAgent: createOrderDto.userAgent ?? null,
        isTest: createOrderDto.isTest ?? false,
      },
    );

    return {
      ...order,
      // These properties are admin-Only
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

  @UseGuards(RoleGuard(UserRole.EATER))
  updateOrder(@Body() updateOrderDto: any) {
    updateOrderDto;
    return null;
  }

  private isAdmin(request: RequestWithUser): boolean {
    return request.user.roles.includes(UserRole.ADMIN);
  }
}
