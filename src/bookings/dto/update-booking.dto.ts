import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

class UpdateBookingDto {
  @IsNotEmpty()
  @IsString()
  bookingId?: string;

  @IsOptional()
  @IsNumber()
  bookedForTimestamp: number;

  @IsOptional()
  @IsBoolean()
  hasArrived: boolean;

  @IsOptional()
  @IsBoolean()
  hasCancelled: boolean;
}

export default UpdateBookingDto;
