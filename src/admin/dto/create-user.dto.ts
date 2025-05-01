import { IsString,IsNotEmpty,MinLength,IsEmail, IsOptional } from "class-validator";

export class CreateuserDto{
    @IsString()
    @IsNotEmpty()
    username:string;

    @IsNotEmpty()
    @MinLength(6)
    password:string

    @IsEmail()
    email:string

    @IsOptional()
    role:string
}
