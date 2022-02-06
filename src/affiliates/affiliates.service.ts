import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AffiliateSubmissionEntity } from 'src/entities/affiliate-submission.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AffiliatesService {
  /**
   * @ignore
   */
  constructor(
    @InjectRepository(AffiliateSubmissionEntity)
    private affiliateSubmissionsRepository: Repository<AffiliateSubmissionEntity>,
  ) {}

  async getAffiliateSubmissions() {
    return null;
  }

  async createNewSubmission(platform: string, reference: string) {
    const entity = this.affiliateSubmissionsRepository.create({
      platform,
      reference,
    });

    return this.affiliateSubmissionsRepository.save(entity);
  }
}
