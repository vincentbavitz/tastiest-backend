import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthenticatedUser } from 'src/auth/auth.model';
import { OrdersService } from 'src/orders/orders.service';

@Injectable()
export class PaymentsService {
  constructor(
    private configService: ConfigService,
    private ordersService: OrdersService,
  ) {}

  async pay(token: string, requestUser: AuthenticatedUser, userAgent?: string) {
    // Get order from token
    // const order = await this.ordersService.
    // if (requestUser.uid !== )
  }
}
