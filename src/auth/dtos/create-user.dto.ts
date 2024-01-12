import { IsEmail, IsEnum, IsString, IsNotEmpty } from 'class-validator';
import { UserRole } from './enum'



export class CreateUserDto {
    @IsString()
    username: string;

    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsEnum(UserRole)
    role: UserRole = UserRole.VIEWER;
}
