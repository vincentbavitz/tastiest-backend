import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { AffiliateSubmissionEntity } from 'src/entities/affiliate-submission.entity';
import { Repository } from 'typeorm';

export const ANONYMOUS_USER_ID = 'anonymous-user';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Analytics = require('analytics-node');

@Injectable()
export class AffiliatesService {
  private analytics: any;

  /**
   * @ignore
   */
  constructor(
    @InjectRepository(AffiliateSubmissionEntity)
    private affiliateSubmissionsRepository: Repository<AffiliateSubmissionEntity>,
    private configService: ConfigService,
  ) {
    this.analytics = new Analytics(
      this.configService.get<string>('ANALYTICS_WRITE_KEY'),
    );
  }

  async getAffiliateSubmissions() {
    return null;
  }

  async createNewSubmission(
    platform: string,
    reference: string,
    userId?: string,
    anonymousId = ANONYMOUS_USER_ID,
  ) {
    const entity = this.affiliateSubmissionsRepository.create({
      platform,
      reference,
    });

    if (userId || anonymousId) {
      await this.analytics.track({
        event: 'New Affiliate Submission',
        userId: userId,
        anonymousId: userId ? undefined : anonymousId,
        timestamp: new Date(),
        properties: {
          platform,
          reference,
          timestamp: Date.now(),
        },
      });
    }

    return this.affiliateSubmissionsRepository.save(entity);
  }
}
