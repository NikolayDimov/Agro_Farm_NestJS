import {
  IsEmail,
  IsEnum,
  IsString,
  IsNotEmpty,
  MaxLength,
} from "class-validator";
import { UserRole } from "./role.enum";

export class CreateUserDto {
  @IsString()
  @MaxLength(20)
  username: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  password: string;

  @IsEnum(UserRole)
  role: UserRole = UserRole.VIEWER;
}
