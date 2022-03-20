import { Type } from 'class-transformer';
import {
  IsEmail,
  IsInt,
  IsISO8601,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

/**
 * The shape of a reservation coming from e-Res API.
 *
 * This shape has not been verified by e-Res.
 * Come fields marked as optional may not be, and so on.
 */
export class ReservationShapeERes {
  @IsString()
  id: string;

  @IsString()
  cust_id: string;

  @IsOptional()
  @IsString()
  room_id: string;

  @IsOptional()
  @IsString()
  room?: string;

  @IsOptional()
  @IsString()
  meal_id: string;

  @IsString()
  meal: string;

  @IsString()
  @IsISO8601()
  dateTime: string;

  @IsInt()
  @IsPositive()
  duration: number;

  @IsInt()
  @IsPositive()
  adults: number;

  @IsString()
  status: string;

  @Type(() => CustomerShapeERes)
  customer: CustomerShapeERes;
}

class CustomerShapeERes {
  @IsString()
  id: string;

  /**
   * Eg. Mr, Mrs, Prof.
   */
  @IsOptional()
  @IsString()
  title: string;

  @IsString()
  firstname: string;

  @IsString()
  surname: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  mobile: string;
}
