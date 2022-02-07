import { IsOptional, IsString, MinLength } from 'class-validator';

class PayDto {
  @IsString()
  @MinLength(32)
  token: string;

  @IsOptional()
  @IsString()
  userAgent?: string;
}

export default PayDto;
