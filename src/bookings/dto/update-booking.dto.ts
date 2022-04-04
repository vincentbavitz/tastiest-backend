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
  booking_id: string;

  @IsOptional()
  @IsBoolean()
  has_arrived?: boolean;

  @IsOptional()
  @IsBoolean()
  has_cancelled?: boolean;

  @IsOptional()
  @IsNumber()
  booked_for_timestamp?: number;
}

export default UpdateBookingDto;
