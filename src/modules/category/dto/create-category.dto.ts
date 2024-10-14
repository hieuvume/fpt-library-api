import { IsString, IsInt, IsEmail, Length, Min } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @Length(5, 20)
  title: string;

  @IsString()
  @Length(10, 100)
  description: string;

}
