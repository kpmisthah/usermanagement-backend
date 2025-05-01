import { IsString,IsOptional } from "class-validator";

export class UpdateProfileDto {
    @IsString()
    @IsOptional()
    username?:string;

    @IsString()
    @IsOptional()
    email?:string;

    @IsString()
    @IsOptional()
    password?:string

    @IsString()
    @IsOptional()
    profilePic?:string

}