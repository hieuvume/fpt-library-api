
import { IsString, IsInt, Min, Max } from 'class-validator';

export class CreateFeedbackDto {
  @IsString()
  content: string;

  @IsInt()
  @Min(0)
  @Max(5)
  rating: number;
}
