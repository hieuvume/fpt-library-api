import { IsString, IsNotEmpty, IsNumber, IsOptional, IsDate } from 'class-validator';
import { Types } from 'mongoose';

export class CreateBookDto {
  @IsNotEmpty()
  book_title: Types.ObjectId;

  @IsString()
  @IsNotEmpty()
  uniqueId: string;

  @IsString()
  @IsNotEmpty()
  section: string;

  @IsString()
  @IsNotEmpty()
  shelf: string;

  @IsNumber()
  @IsNotEmpty()
  floor: number;

  @IsNumber()
  @IsNotEmpty()
  position: number;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsDate()
  @IsOptional()
  created_at?: Date;

  @IsDate()
  @IsOptional()
  updated_at?: Date;
}