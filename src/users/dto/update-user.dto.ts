import { Type } from 'class-transformer';
import {
  IsDateString,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { UserFinancialDto } from './user-financial.dto';
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

  // Add this in later
  // @IsOptional()
  // @IsJSON()
  // preferences?: Partial<UserPreferences>;

  @IsOptional()
  @ValidateNested()
  @Type(() => UserFinancialDto)
  financial?: UserFinancialDto;
}

export default UpdateUserDto;
