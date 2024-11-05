import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateMemberShipDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  price_monthly?: number;

  @IsNumber()
  @IsOptional()
  price_yearly?: number;

  @IsNumber()
  @IsOptional()
  max_borrow_days?: number;

  @IsNumber()
  @IsOptional()
  max_borrow_books_per_time?: number;

  @IsNumber()
  @IsOptional()
  max_reserve_books_per_montly?: number;

  @IsBoolean()
  @IsOptional()
  renewal_allowed?: boolean;

  @IsBoolean()
  @IsOptional()
  hold_allowed?: boolean;

  @IsString()
  @IsOptional()
  color?: string;
}
