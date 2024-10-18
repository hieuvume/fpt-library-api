import { IsEmail, Length } from "class-validator";

export class SignInDto {
  @IsEmail()
  email: string;

  @Length(6, 50, {
    message: "Password must be between 6 and 50 characters",
  })
  password: string;
}
