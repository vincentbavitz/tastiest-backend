import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  product_id: string;

  @IsNumber()
  @IsInt()
  @IsPositive()
  heads: number;

  @IsNumber()
  @IsInt()
  @IsPositive()
  booked_for_timestamp: number;

  @IsOptional()
  @IsString()
  promo_code?: string;

  @IsOptional()
  @IsString()
  user_agent?: string;

  @IsOptional()
  @IsBoolean()
  is_test?: boolean;
}

export default CreateOrderDto;
