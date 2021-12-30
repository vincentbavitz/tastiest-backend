import { IsNotEmpty, IsString, MinLength } from 'class-validator';

class GetUserDto {
  @IsString()
  @MinLength(1)
  @IsNotEmpty()
  uid: string;
}

export default GetUserDto;
