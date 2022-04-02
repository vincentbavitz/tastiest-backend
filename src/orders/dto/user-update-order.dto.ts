import { IsOptional, IsString } from 'class-validator';

/**
 * User updatable data only.
 * Eg. when they're in the checkout screen.
 */
class UserUpdateOrderDto {
  @IsString()
  token: string;

  @IsOptional()
  @IsString()
  payment_method?: string;
}

export default UserUpdateOrderDto;
