import { IsNotEmpty, IsString, MinLength } from 'class-validator';

class GetAccountDto {
  @IsString()
  @MinLength(1)
  @IsNotEmpty()
  uid: string;
}

export default GetAccountDto;
