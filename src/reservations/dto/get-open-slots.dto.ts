import { IsString, MinLength } from 'class-validator';
import { Zone } from 'luxon';

class GetOpenSlotsDto {
  @IsString()
  @MinLength(1)
  restaurant_id: string;

  // eg. `Europe/London`
  @IsString()
  timezone: Zone;
}

export default GetOpenSlotsDto;
