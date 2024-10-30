import { IsEnum, IsString } from "class-validator";

export class UpgradePlanDto {

    @IsString()
    membershipId: string;

    @IsEnum([1, 3, 6, 12, 24])
    months: number;

    @IsEnum(["banking", "momo", "cash"])
    payment_method: string;

}
