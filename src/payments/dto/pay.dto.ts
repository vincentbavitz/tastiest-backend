import {
  IsISO8601,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';

class PayDto {
  @IsString()
  @MinLength(32)
  token: string;

  @IsString()
  payment_method: string;

  // Will modify user data after payment if payment is successful
  // May differ from their name on file.
  @IsString()
  given_first_name: string;

  // May differ from their name on file.
  @IsString()
  given_last_name: string;

  @IsString()
  @IsPhoneNumber('GB')
  mobile: string;

  @IsString()
  @IsISO8601()
  birthday: string;

  @IsString()
  postcode: string;

  @IsOptional()
  @IsString()
  user_agent?: string;
}

export default PayDto;
