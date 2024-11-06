// update-membership.dto.ts
import { IsString, IsNumber, IsBoolean, IsOptional, Min } from 'class-validator';

export class UpdateMembershipDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price_monthly?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price_yearly?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  max_borrow_days?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  max_borrow_books_per_time?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  max_reserve_books_per_montly?: number;

  @IsOptional()
  @IsBoolean()
  renewal_allowed?: boolean;

  @IsOptional()
  @IsBoolean()
  hold_allowed?: boolean;
}
