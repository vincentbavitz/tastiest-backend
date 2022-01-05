import { UserRole } from '@tastiest-io/tastiest-utils';
import { Transform } from 'class-transformer';
import {
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

class GetAccountsDto {
  @IsString()
  @IsIn(Object.values(UserRole))
  @IsOptional()
  role: UserRole;

  @IsNumber()
  @Min(1)
  @Max(1000)
  @IsOptional()
  @Transform(({ value }) => Number.parseInt(value))
  limit: number;

  @IsString()
  @IsOptional()
  pageToken: string;
}

export default GetAccountsDto;
