import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ANONYMOUS_USER_ID,
  TrackingService,
} from 'src/tracking/tracking.service';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { AffiliateSubmissionEntity } from './entities/affiliate-submission.entity';

@Injectable()
export class AffiliatesService {
  /**
   * @ignore
   */
  constructor(
    private readonly usersService: UsersService,
    private readonly trackingService: TrackingService,
    @InjectRepository(AffiliateSubmissionEntity)
    private affiliateSubmissionsRepository: Repository<AffiliateSubmissionEntity>,
  ) {}

  async getAffiliateSubmissions() {
    return null;
  }

  /** FIX ME MIGRATE TO PRISMA */
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

    await this.trackingService.track(
      eventName,
      { userId },
      { platform, reference },
    );

    // Add user to entity if it exists
    if (userId) {
      const user = await this.usersService.getUser(userId);
      // entity.userId = user;
    }

    return this.affiliateSubmissionsRepository.save(entity);
  }
}
