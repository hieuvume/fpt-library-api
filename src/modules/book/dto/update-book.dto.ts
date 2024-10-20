
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsDate } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateBookDto {
  @IsOptional()
  book_title?: Types.ObjectId;

  @IsString()
  @IsOptional()
  uniqueId?: string;

  @IsString()
  @IsOptional()
  section?: string;

  @IsString()
  @IsOptional()
  shelf?: string;

  @IsNumber()
  @IsOptional()
  floor?: number;

  @IsNumber()
  @IsOptional()
  position?: number;

  @IsString()
  @IsOptional()
  status?: string;

  @IsDate()
  @IsOptional()
  created_at?: Date;

  @IsDate()
  @IsOptional()
  updated_at?: Date;
}
