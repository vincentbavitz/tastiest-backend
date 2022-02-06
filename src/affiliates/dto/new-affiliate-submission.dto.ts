import { IsIn, IsString, MaxLength, MinLength } from 'class-validator';

class NewAffiliateSubmissionDto {
  @IsString()
  @IsIn(['instagram', 'tiktok', 'facebook', 'youtube', 'website'])
  platform: string;

  /** The reference to the platform, eg `@username` */
  @IsString()
  @MinLength(2)
  @MaxLength(64)
  reference: string;
}

export default NewAffiliateSubmissionDto;
