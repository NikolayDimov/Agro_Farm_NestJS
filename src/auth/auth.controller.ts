import { Body, Controller, Post, HttpCode, HttpStatus, UseGuards, Get, Request } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserDto } from "./dtos/user.dto";
import { AuthGuard } from "./auth.guard";
import { CreateUserDto } from "./dtos/create-user.dto";
import { Serialize } from "../interceptors/serialize.interceptor";
import { CurrentUser } from "./decorator/current-user.decorator";
import { User } from "../users/user.entity";

import { createParamDecorator, ExecutionContext } from "@nestjs/common";

import { SignInDto } from "./dtos/signIn.dto";

@Controller('auth')
// @Serialize(UserDto)
export class AuthController {
    constructor(private authService: AuthService) {}

    // @HttpCode(HttpStatus.OK)
    // //@UseGuards(AuthGuard)
    // @Post("/login")
    // signIn(@Body() userLog: SignInDto) {
    //     const user = this.authService.signIn(userLog);
    //     console.log('User found:', user);
    //     return this.authService.signIn(userLog);
    // }

    @HttpCode(HttpStatus.OK)
    @Post("login")
    signIn(@Body() signInDto: SignInDto) {
        return this.authService.signIn(signInDto);
    }

    // @HttpCode(HttpStatus.OK)
    // @Post("/login")
    // async signIn(@Body() userLog: SignInDto) {
    //     try {
    //         const token = await this.authService.signIn(userLog.username, userLog.password);
    //         return { access_token: token.access_token };
    //     } catch (error) {
    //         // Handle the error, for example, return a custom response
    //         console.error("Error during sign-in:", error.message);
    //         return { message: "User not found", statusCode: 404 };
    //     }
    // }

    @Post("/register")
    async createUser(@Body() user: CreateUserDto) {
        const userCreate = await this.authService.signUp(user); // creating User with authentication
        return userCreate;
    }

    // @Get("/currentUser")
    // @UseGuards(AuthGuard)
    // whoAmI(@CurrentUser() user: User) {
    //     return {
    //         id: user.id,
    //         username: user.username,
    //         email: user.email,
    //     };
    // }

    // @Get("/test")
    // @UseGuards(AuthGuard)
    // testRoute(@CurrentUser() user: User) {
    //     console.log("Current User: ", user);
    //     return { user };
    // }

    // @Post("signout")
    // logout(@Res() res: Response) {
    //     // Clear JWT token on the client side
    //     res.clearCookie("jwt_token"); // Example for clearing a cookie

    //     // Return a successful response
    //     return res.status(HttpStatus.OK).json({ message: "Logout successful" });
    // }

    // @Get("/profile")
    // @UseGuards(AuthGuard)
    // getProfile(@CurrentUser() user: User): User {
    //     return user;
    // }

    @UseGuards(AuthGuard)
    @Get("/profile")
    getProfile(@Request() req) {
        return req.user;
    }
}
