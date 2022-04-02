import {
  Body,
  Controller,
  Headers,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from '@tastiest-io/tastiest-utils';
import { RequestWithUser } from 'src/auth/auth.model';
import RoleGuard from 'src/auth/role.guard';
import { OrdersService } from 'src/orders/orders.service';
import { UsersService } from 'src/users/users.service';
import PayDto from './dto/pay.dto';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly usersService: UsersService,
    private readonly ordersService: OrdersService,
  ) {}

  /**
   * Pay an order from tastiest.io/checkout/[token]
   */
  @UseGuards(RoleGuard(UserRole.EATER))
  @Post('pay')
  async pay(@Body() data: PayDto, @Request() request: RequestWithUser) {
    return this.paymentsService.pay(data, request.user);
  }

  /**
   * Coming directly from Stripe.
   */
  @Post('public/payment-success-webhook')
  async onPaymentSuccessWebhook(@Body() body: any, @Headers() headers: any) {
    return this.paymentsService.onPaymentSuccessWebhook(body, headers);
  }
}
