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
  productId: string;

  @IsNumber()
  @IsInt()
  @IsPositive()
  heads: number;

  @IsNumber()
  @IsInt()
  @IsPositive()
  bookedForTimestamp: number;

  @IsOptional()
  @IsString()
  promoCode?: string;

  @IsOptional()
  @IsString()
  userAgent?: string;

  @IsOptional()
  @IsBoolean()
  isTest?: boolean;
}

export default CreateOrderDto;
