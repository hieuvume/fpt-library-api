import { IsAlpha, IsEmail, IsString, Length, Matches } from "class-validator";

export class SignUpDto {
  @IsEmail()
  email: string;

  @Length(6, 50)
  password: string;

  @IsString()
  @Length(5, 50)
  full_name: string;

  @Matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, {
    message: "Phone number is not valid",
  })
  phone_number: string;
}
