import { IsBoolean, IsOptional, IsString } from 'class-validator';

/** We get userID from the request's JWT token */
class FollowRestaurantDto {
  @IsString()
  restaurant_id: string;

  @IsOptional()
  @IsBoolean()
  notify_new_nenu: boolean;

  @IsOptional()
  @IsBoolean()
  notify_general_info: boolean;

  @IsOptional()
  @IsBoolean()
  notify_last_minute_tables: boolean;

  @IsOptional()
  @IsBoolean()
  notify_limited_time_dishes: boolean;

  @IsOptional()
  @IsBoolean()
  notify_special_sxperiences: boolean;
}

export default FollowRestaurantDto;
