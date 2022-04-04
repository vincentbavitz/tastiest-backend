import { TimeRange } from '@tastiest-io/tastiest-horus';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';

class SetOpenTimesDto {
  @IsString()
  @MinLength(1)
  @IsNotEmpty()
  restaurant_id: string;

  /** A number; given in minutes */
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(400)
  seating_duration: number;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsNumber({}, { each: true })
  @IsInt({ each: true })
  0: TimeRange;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsNumber({}, { each: true })
  @IsInt({ each: true })
  1: TimeRange;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsNumber({}, { each: true })
  @IsInt({ each: true })
  2: TimeRange;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsNumber({}, { each: true })
  @IsInt({ each: true })
  3: TimeRange;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsNumber({}, { each: true })
  @IsInt({ each: true })
  4: TimeRange;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsNumber({}, { each: true })
  @IsInt({ each: true })
  5: TimeRange;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsNumber({}, { each: true })
  @IsInt({ each: true })
  6: TimeRange;
}

export default SetOpenTimesDto;
