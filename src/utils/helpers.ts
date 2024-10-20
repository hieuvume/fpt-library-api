import { BadRequestException } from "@nestjs/common";

export const badMessage = (property: string, message: string) => {
    throw new BadRequestException({
        message: [
            {
                property,
                message,
            },
        ],
    });
}