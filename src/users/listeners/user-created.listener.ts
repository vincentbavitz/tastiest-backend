import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import Stripe from 'stripe';
import { UserCreatedEvent } from '../events/user-created.event';
import { UsersService } from '../users.service';

@Injectable()
export class UserCreatedListener {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {}

  @OnEvent('user.created')
  async handleUserCreatedEvent(event: UserCreatedEvent) {
    const STRIPE_SECRET_KEY = event.isTestAccount
      ? this.configService.get('STRIPE_TEST_SECRET_KEY')
      : this.configService.get('STRIPE_LIVE_SECRET_KEY');

    const stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: '2020-08-27',
    });

    // //////////////////////////////////////////////////////// //
    // //////////////     Create Stripe customer     ////////// //
    // //////////////////////////////////////////////////////// //
    //  When a user is created, create a Stripe customer object for them.
    // https://stripe.com/docs/payments/save-and-reuse#web-create-customer
    const customer = await stripe.customers.create({
      email: event.userRecord.email,
    });

    const intent = await stripe.setupIntents.create({
      customer: customer.id,
    });

    // Save to the new users database entry.
    await this.usersService.updateUser({
      uid: event.userRecord.uid,
      financial: {
        stripeCustomerId: customer.id ?? null,
        stripeSetupSecret: intent.client_secret ?? null,
      },
    });

    // Set setup secret etc
    // this.usersService.

    // userDataApi.setUserData(UserDataKey.PAYMENT_DETAILS, {
    //   stripeCustomerId: customer.id,
    //   stripeSetupSecret: intent.client_secret ?? undefined,
    // });

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
