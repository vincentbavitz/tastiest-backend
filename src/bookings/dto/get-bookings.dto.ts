import { IsOptional, IsString } from 'class-validator';

class GetBookingsDto {
  @IsOptional()
  @IsString()
  user_id?: string;

  @IsOptional()
  @IsString()
  restaurant_id?: string;
}

export default GetBookingsDto;
