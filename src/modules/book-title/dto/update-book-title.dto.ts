// dto/update-book-title.dto.ts
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsUrl } from 'class-validator';

export class UpdateBookTitleDto {
  @IsString()

  title: string;

  @IsString()

  author: string;

  @IsString()

  ISBN: string;

  @IsString()

  description: string;

  @IsOptional()
  @IsUrl()
  cover_image?: string;

  @IsOptional()
  @IsNumber()
  price?: number;
}
