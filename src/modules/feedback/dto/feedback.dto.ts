// create-feedback.dto.ts
import { IsNotEmpty, IsString, IsNumber, Max, Min } from 'class-validator';

export class CreateFeedbackDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;
}
