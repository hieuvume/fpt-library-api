// create-membership.dto.ts
import { IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class CreateMembershipDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  price_monthly: number;

  @IsNumber()
  price_yearly: number;

  @IsNumber()
  max_borrow_days: number;

  @IsNumber()
  max_borrow_books_per_time: number;

  @IsNumber()
  max_reserve_books_per_montly: number;

  @IsBoolean()
  renewal_allowed: boolean;

  @IsBoolean()
  hold_allowed: boolean;

  @IsString()
  color: string; // Trường này là tùy chọn
}
