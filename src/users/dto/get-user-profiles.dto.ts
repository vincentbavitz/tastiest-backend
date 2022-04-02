import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

class GetUserProfilesDto {
  @IsNumber()
  @Min(1)
  @Max(1000)
  @IsOptional()
  @Transform(({ value }) => Number.parseInt(value))
  limit: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @Transform(({ value }) => Number.parseInt(value))
  skip: number;
}

export default GetUserProfilesDto;
