import { IsJSON, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { WeekOpenTimes } from 'horus/dist';

class SetOpenTimesDto {
  @IsString()
  @MinLength(1)
  @IsNotEmpty()
  restaurant_id: string;

  @IsJSON()
  open_times: WeekOpenTimes;
}

export default SetOpenTimesDto;
