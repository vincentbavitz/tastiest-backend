import {
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
  dealId: string;

  @IsString()
  userId: string;

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
  @IsString()
  isTest?: boolean;
}

export default CreateOrderDto;
