import { IsOptional, IsString } from 'class-validator';

export class UserFinancialDto {
  @IsOptional()
  @IsString()
  stripeCustomerId?: string;

  @IsOptional()
  @IsString()
  stripeSetupSecret?: string;
}
