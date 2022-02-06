import { Body, Controller, Post } from '@nestjs/common';
import { AffiliatesService } from './affiliates.service';
import NewAffiliateSubmissionDto from './dto/new-affiliate-submission.dto';

@Controller('public/affiliates')
export class AffiliatesController {
  constructor(private readonly affiliatesService: AffiliatesService) {}

  /**
   * A new affiliate submission from tastiest.io/affiliate-program
   */
  @Post('new-submission')
  newAffiliateSubmission(
    @Body() newAffiliateSubmissionDto: NewAffiliateSubmissionDto,
  ) {
    this.affiliatesService.createNewSubmission(
      newAffiliateSubmissionDto.platform,
      newAffiliateSubmissionDto.reference,
      newAffiliateSubmissionDto.userId,
      newAffiliateSubmissionDto.anonymousId,
    );
  }
}
