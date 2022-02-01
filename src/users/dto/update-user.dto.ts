import {
  PaymentDetails,
  UserMetrics,
  UserPreferences,
} from '@tastiest-io/tastiest-utils';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsJSON,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { UserLocationDto } from './user-location.dto';

class UpdateUserDto {
  @IsString()
  uid: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  mobile?: string;

  @IsOptional()
  @IsDateString()
  birthday?: Date;

  @IsOptional()
  @ValidateNested()
  @Type(() => UserLocationDto)
  location?: UserLocationDto;

  @IsOptional()
  @IsJSON()
  metrics?: Partial<UserMetrics>;

  @IsOptional()
  @IsJSON()
  preferences?: Partial<UserPreferences>;

  @IsOptional()
  @IsJSON()
  financial?: Partial<PaymentDetails>;
}

export default UpdateUserDto;
