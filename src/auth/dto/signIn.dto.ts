import { IsString,IsNotEmpty,MinLength,IsEmail } from "class-validator";

export class usersignIndto{
    @IsString()
    @IsNotEmpty()
    username:string;

    @IsNotEmpty()
    @MinLength(6)
    password:string

    @IsEmail()
    email:string

    role:string
}
