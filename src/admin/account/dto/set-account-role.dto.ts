import { UserRole } from '@tastiest-io/tastiest-utils';
import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

class SetAccountRoleDto {
  @IsString()
  @MinLength(1)
  @IsNotEmpty()
  uid: string;

  @IsString()
  @IsIn(Object.values(UserRole))
  @IsOptional()
  role: UserRole;
}

export default SetAccountRoleDto;
