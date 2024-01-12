import {
    Body,
    Controller,
    Post,
    Get,
    Patch,
    Delete,
    Param,
    Query,
    NotFoundException,
    UseGuards,
    Res, 
    HttpStatus
} from "@nestjs/common";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UpdateuserDto } from "./dtos/update-user.dto";
import { UsersService } from "./users.service";
import { Serialize } from "../interceptors/serialize.interceptor";
import { UserDto } from "./dtos/user.dto";
import { AuthService } from "../auth/auth.service";
import { CurrentUser } from "./decorators/current-user.decorators";
import { User } from "./user.entity";
import { AuthGuard } from "../guards/auth.guard";
import { Response } from 'express';

@Controller()
@Serialize(UserDto) // no password return for user
export class UsersController {
    constructor(
        private userService: UsersService,
        private authService: AuthService
    ) {}


}
