import { IsEmail, IsString, Length, Matches } from "class-validator";

export class SignUpDto {
  @IsEmail()
  email: string;

  @Length(6, 50, {
    message: "Password must be between 6 and 50 characters",
  })
  password: string;

  @IsString({
    message: "Full name must be a string",
  })
  @Length(6, 50, {
    message: "Full name must be between 6 and 50 characters",
  })
  full_name: string;

  @Matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, {
    message: "Phone number is not valid",
  })
  phone_number: string;
}
