import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(32)
  password: string;

  @IsString()
  @MinLength(2)
  @MaxLength(32)
  firstName: string;

  @IsOptional()
  @IsString()
  userAgent: string;

  @IsOptional()
  @IsString()
  anonymousId: string;

  @IsOptional()
  @IsBoolean()
  isTestAccount: boolean;
}

export default CreateUserDto;
