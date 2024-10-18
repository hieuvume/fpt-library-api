import { IsString, Length } from "class-validator";

export class ResetPasswordDto {
    @IsString()
    token: string;

    @Length(6, 50)
    password: string;
}
