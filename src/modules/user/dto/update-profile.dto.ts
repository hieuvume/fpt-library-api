import {
  IsString,
  IsInt,
  IsEmail,
  Length,
  Min,
  Matches,
  IsEnum,
  IsOptional,
  IsDate,
} from "class-validator";

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @Length(5, 50)
  full_name: string;

  @IsOptional()
  @Matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, {
    message: "Phone number is not valid",
  })
  phone_number: string;

  @IsOptional()
  @IsEnum(["male", "female"])
  gender: string;

  @IsOptional()
  @IsString()
  @Length(5, 50)
  address: string;

  @IsOptional()
  @IsDate()
  date_of_birth: Date;
}
