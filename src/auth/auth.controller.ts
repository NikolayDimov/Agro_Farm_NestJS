import { Body, Controller, Post, HttpCode, HttpStatus, UseGuards, Get, Request } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserDto } from "./user.dto";
import { AuthGuard } from "./auth.guard";
import { CreateUserDto } from "./create-user.dto";
import { Serialize } from "../interceptors/serialize.interceptor";
import { CurrentUser } from "../users/decorators/current-user.decorators";
import { User } from "../users/user.entity";


@Controller("auth")
@Serialize(UserDto)

export class AuthController {
    constructor(private authService: AuthService) {}

    @HttpCode(HttpStatus.OK)
    //@UseGuards(AuthGuard)
    @Post("/login")
    signIn(@Body() user: CreateUserDto) {
        return this.authService.signIn(user);
    }



    @Post("/register")
    async createUser(@Body() user: CreateUserDto) {
        const userCreate = await this.authService.signUp(user);  // creating User with authentication
        return userCreate;
    }


    @Get("/currentUser")
    // @UseGuards(AuthGuard)
    whoAmI(@CurrentUser() user: User) {
        return user;
    }

    // @Post("signout")
    // logout(@Res() res: Response) {
    //     // Clear JWT token on the client side
    //     res.clearCookie("jwt_token"); // Example for clearing a cookie

    //     // Return a successful response
    //     return res.status(HttpStatus.OK).json({ message: "Logout successful" });
    // }


    //@UseGuards(AuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
      return req.user;
    }
}
