import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import Stripe from 'stripe';
import { UserCreatedEvent } from '../events/user-created.event';

@Injectable()
export class UserCreatedListener {
  constructor(private configService: ConfigService) {}

  @OnEvent('user.created')
  async handleUserCreatedEvent(event: UserCreatedEvent) {
    event.userRecord.uid;

    const STRIPE_SECRET_KEY = event.isTestAccount
      ? this.configService.get('STRIPE_TEST_SECRET_KEY')
      : this.configService.get('STRIPE_LIVE_SECRET_KEY');

    const stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: '2020-08-27',
    });

    console.log('event', event);
    console.log('event', event);
    console.log('event', event);
    console.log('event', event);
    console.log('event', event);
    console.log('event', event);
    console.log('event', event);
    console.log('event', event);
    console.log('event', event);
    console.log('event', event);
    console.log('event', event);
    console.log('event', event);
    console.log('event', event);
  }
}
