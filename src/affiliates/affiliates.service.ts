import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  ANONYMOUS_USER_ID,
  TrackingService,
} from 'src/tracking/tracking.service';

@Injectable()
export class AffiliatesService {
  /**
   * @ignore
   */
  constructor(
    private readonly trackingService: TrackingService,
    private prisma: PrismaService,
  ) {}

  async getAffiliateSubmissions() {
    return this.prisma.affiliateSubmission.findMany();
  }

  async createNewSubmission(
    platform: string,
    reference: string,
    affiliateType: string,
    userId?: string,
    anonymousId = ANONYMOUS_USER_ID,
  ) {
    const eventName =
      affiliateType === 'general'
        ? 'New Affiliate Submission'
        : 'New Influencer Submission';

    await this.trackingService.track(eventName, {
      who: { userId, anonymousId },
      properties: { platform, reference },
    });

    return this.prisma.affiliateSubmission.create({
      data: {
        platform,
        reference,
        affiliate_type: affiliateType,
        user_id: userId,
      },
    });
  }
}
