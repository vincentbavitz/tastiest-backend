import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { AffiliateSubmissionEntity } from 'src/entities/affiliate-submission.entity';
import { UsersService } from 'src/users/users.service';
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
    private usersService: UsersService,
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
    affiliateType: string,
    userId?: string,
    anonymousId = ANONYMOUS_USER_ID,
  ) {
    const entity = this.affiliateSubmissionsRepository.create({
      platform,
      reference,
      affiliateType,
    });

    const eventName =
      affiliateType === 'general'
        ? 'New Affiliate Submission'
        : 'New Influencer Submission';

    await this.analytics.track({
      event: eventName,
      userId: userId,
      anonymousId: userId ? undefined : anonymousId,
      timestamp: new Date(),
      properties: {
        platform,
        reference,
        timestamp: Date.now(),
      },
    });

    // Add user to entity if it exists
    if (userId) {
      const userEntity = await this.usersService.getUser(userId);
      entity.user = userEntity;
    }

    return this.affiliateSubmissionsRepository.save(entity);
  }
}
