import { IsBoolean, IsOptional, IsString } from 'class-validator';

/** We get userID from the request's JWT token */
class FollowRestaurantDto {
  @IsString()
  restaurantId: string;

  @IsOptional()
  @IsBoolean()
  notifyNewMenu: boolean;

  @IsOptional()
  @IsBoolean()
  notifyGeneralInfo: boolean;

  @IsOptional()
  @IsBoolean()
  notifyLastMinuteTables: boolean;

  @IsOptional()
  @IsBoolean()
  notifyLimitedTimeDishes: boolean;

  @IsOptional()
  @IsBoolean()
  notifySpecialExperiences: boolean;
}

export default FollowRestaurantDto;
