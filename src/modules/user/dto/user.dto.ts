import { IsEmail, IsString, IsNotEmpty, IsPhoneNumber, ValidateNested, Length, IsDate, Matches } from 'class-validator';
import { Type } from 'class-transformer';

class IdCardDto {
    @IsString()
    @IsNotEmpty({ message: 'ID number is required' })
    id_number: string;

    @IsDate()
    @IsNotEmpty({ message: 'Date is required' })
    date: Date;

    @IsString()
    @IsNotEmpty({ message: 'Place is required' })
    place: string;
}

export class UserDto {
    @Length(6, 50, {
        message: "Password must be between 6 and 50 characters",
      })
    password: string;
}
