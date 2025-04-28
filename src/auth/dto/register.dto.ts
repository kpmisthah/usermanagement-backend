import { IsString,MinLength, IsNotEmpty } from "class-validator";
export class registerdto{
    @IsString()
    @IsNotEmpty()
    username:string

    @IsNotEmpty()
    @MinLength(6)
    password:string
}