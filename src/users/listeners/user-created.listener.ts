import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { UserRole } from '@tastiest-io/tastiest-utils';
import Stripe from 'stripe';
import { UserCreatedEvent } from '../events/user-created.event';
import { UsersService } from '../users.service';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Analytics = require('analytics-node');

@Injectable()
export class UserCreatedListener {
  private analytics: any;

  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    this.analytics = new Analytics(
      this.configService.get<string>('ANALYTICS_WRITE_KEY'),
    );
  }

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

    // Track User Created
    if (event.anonymousId) {
      await this.analytics.identify({
        anonymousId: event.anonymousId,
        traits: {
          userId: event.userRecord.uid,
          email: event.userRecord.email,
          firstName: event.firstName,
        },
        context: { userAgent: event.userAgent ?? null },
      });
    }

    // No need to await tracking after we've identified them
    await this.analytics.track({
      userId: event.userRecord?.uid,
      event: 'User Signed Up',
      properties: {
        role: UserRole.EATER,
        name: event.firstName,
        email: event.userRecord.email,
      },
      context: { userAgent: event.userAgent ?? null },
    });

    console.log('event', event);
  }
}