import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserRole } from '@tastiest-io/tastiest-utils';
import RoleGuard from 'src/auth/role.guard';
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
      newAffiliateSubmissionDto.affiliateType,
      newAffiliateSubmissionDto.userId,
      newAffiliateSubmissionDto.anonymousId,
    );
  }

  @UseGuards(RoleGuard(UserRole.ADMIN))
  @Get('')
  getAffiliateSubmissions() {
    return this.affiliatesService.getAffiliateSubmissions();
  }
}
