import { IsString, MinLength } from 'class-validator';

class GetReservationsDto {
  @IsString()
  @MinLength(1)
  restaurant_id: string;
}

export default GetReservationsDto;
