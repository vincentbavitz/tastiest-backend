import { IsNotEmpty, IsString, MinLength } from 'class-validator';

class GetOpenTimesDto {
  @IsString()
  @MinLength(1)
  @IsNotEmpty()
  restaurant_id: string;
}

export default GetOpenTimesDto;
