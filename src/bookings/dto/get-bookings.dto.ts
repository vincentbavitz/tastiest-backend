import { IsOptional, IsString } from 'class-validator';

class GetBookingsDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  restaurantId?: string;
}

export default GetBookingsDto;
