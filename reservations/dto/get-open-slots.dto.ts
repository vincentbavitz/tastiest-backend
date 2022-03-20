import { IsString, MinLength } from 'class-validator';

class GetOpenSlotsDto {
  @IsString()
  @MinLength(1)
  restaurant_id: string;
}

export default GetOpenSlotsDto;
