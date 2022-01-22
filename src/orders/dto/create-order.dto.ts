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

  @IsNumber()
  @IsInt()
  @IsPositive()
  heads: number;

  @IsString()
  @IsNotEmpty()
  fromSlug: string;

  @IsNumber()
  @IsInt()
  @IsPositive()
  bookedForTimestamp: number;

  @IsOptional()
  @IsString()
  promoCode?: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  anonymousId?: string;

  @IsOptional()
  @IsString()
  userAgent?: string;
}

export default CreateOrderDto;
