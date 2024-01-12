import { Body, Controller, Post, HttpCode, HttpStatus, UseGuards, Get, Request, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserDto } from "./dtos/user.dto";
import { AuthGuard } from "./auth.guard";
import { CreateUserDto } from "./dtos/create-user.dto";
import { Serialize } from "../interceptors/serialize.interceptor";
import { SignInDto } from "./dtos/signIn.dto";
import {UserRole} from '../auth/dtos/enum';

@Controller('auth')
// @Serialize(UserDto)  -> not log the uset in
export class AuthController {
    constructor(private authService: AuthService) {}

    @HttpCode(HttpStatus.OK)
    @Post("login")
    signIn(@Body() signInDto: SignInDto) {
        return this.authService.signIn(signInDto);
    }

    @Post('/register')
    async createUser(@Body() user: CreateUserDto) {
        const userCreate = await this.authService.signUp(user); // creating User with authentication
        return userCreate;
    }

    // @Post("signout")
    // logout(@Res() res: Response) {
    //     // Clear JWT token on the client side
    //     res.clearCookie("jwt_token"); // Example for clearing a cookie

    //     // Return a successful response
    //     return res.status(HttpStatus.OK).json({ message: "Logout successful" });
    // }

    @Post("signout")
    logout() {
        // Simply return a successful response without clearing cookies
        // Client (front end) is responsible for handling the removal of the JWT token.
        return { message: "Logout successful" };
    }

    @UseGuards(AuthGuard)
    @Get("/profile")
    getProfile(@Request() req) {
        return req.user;
    }
}
