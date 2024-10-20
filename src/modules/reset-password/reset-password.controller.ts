import {
    Body,
    Controller,
    Post
} from "@nestjs/common";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { ResetPasswordService } from "./reset-password.service";

@Controller("password")
export class ResetPasswordController {
    constructor(
        private resetPasswordService: ResetPasswordService,
    ) { }

    @Post("request")
    async forgotPassword(@Body() data: ForgotPasswordDto) {
        const { email } = data;
        return this.resetPasswordService.forgotPassword(email);
    }

    @Post("reset")
    async resetPassword(@Body() data: ResetPasswordDto) {
        const { token, password } = data;
        return this.resetPasswordService.resetPassword(token, password);
    }

}
