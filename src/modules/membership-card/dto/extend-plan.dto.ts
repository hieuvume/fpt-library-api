import { IsEnum } from "class-validator";

export class ExtendPlanDto {

    @IsEnum(["banking", "momo", "cash"])
    payment_method: string;

}
