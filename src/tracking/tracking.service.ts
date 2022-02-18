import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import AnalyticsType from 'analytics-node';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Analytics = require('analytics-node');
export const ANONYMOUS_USER_ID = 'anonymous-user';

type TrackingContext = {
  userAgent?: string;
};

type TrackingWho = {
  userId?: string;
  anonymousId?: string;
};

@Injectable()
export class TrackingService {
  private analytics: AnalyticsType;

  constructor(private configService: ConfigService) {
    this.analytics = new Analytics(
      this.configService.get<string>('ANALYTICS_WRITE_KEY'),
    );
  }

  public async identify(
    who: TrackingWho,
    traits: any,
    context?: TrackingContext,
  ) {
    const anonymousId = who.userId
      ? undefined
      : who.anonymousId ?? ANONYMOUS_USER_ID;

    return this.analytics.identify({
      userId: who.userId,
      anonymousId,
      traits: {
        userId: who.userId,
        anonymousId,
        ...traits,
      },
      timestamp: new Date(),
      context: { ...context },
    });
  }

  public async track(
    event: string,
    who: TrackingWho,
    properties: any,
    context?: TrackingContext,
  ) {
    const anonymousId = who.userId
      ? undefined
      : who.anonymousId ?? ANONYMOUS_USER_ID;

    return this.analytics.track({
      event,
      userId: who.userId,
      anonymousId,
      properties,
      timestamp: new Date(),
      context: { ...context },
    });
  }
}
