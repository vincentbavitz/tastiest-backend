import { Order } from '@prisma/client';

export class OrderCreatedEvent {
  constructor(public order: Order, public userAgent?: string) {}
}
