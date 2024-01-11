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

    // @Get('/whoami')
    // whoAmI(@Session() session: any) {
    //     return this.userService.findOne(session.userId);
    // }

    // Custom Decorator Current User
    @Get("/whoami")
    @UseGuards(AuthGuard)
    whoAmI(@CurrentUser() user: User) {
        return user;
    }

    // @Post("/signup")
    // async createUser(@Body() body: CreateUserDto) {
    //     // const result = await this.authService.signUp(body.email, body.password);
    //     // const { access_token } = result;
    //     // // Do not use session, use the information from the JWT token
    //     // return { access_token };
    //     const user = await this.authService.signUp(body.email, body.password);  // creating User with authentication
    //     //session.userId = user.id;
    //     return user;
    // }

    // @Post("/signin")
    // async signin(@Body() body: CreateUserDto) {
    //     const result = await this.authService.signIn(body.email, body.password);
    //     const { access_token } = result;
    //     // Do not use session, use the information from the JWT token
    //     return { access_token };
    // }

    // @Post("signout")
    // logout(@Res() res: Response) {
    //     // Clear JWT token on the client side
    //     res.clearCookie("jwt_token"); // Example for clearing a cookie

    //     // Return a successful response
    //     return res.status(HttpStatus.OK).json({ message: "Logout successful" });
    // }

    // @UseInterceptors(new SerializerInterceptor(UserDto)) // no password return with Get method
    // @Serialize(UserDto)
    // @Get("/:id")
    // async findUser(@Param("id") id: string) {
    //     // console.log('handler is running');
    //     const user = await this.userService.findOne(parseInt(id));
    //     if (!user) {
    //         throw new NotFoundException("user not found");
    //     }
    //     return user;
    // }

    // @Serialize(UserDto)     // no password return for user
    @Get()
    findAllUsers(@Query("email") email: string) {
        return this.userService.find(email);
    }

    // @Delete("/:id")
    // removeUser(@Param("id") id: string) {
    //     return this.userService.remove(parseInt(id));
    // }

    // @Patch("/:id")
    // updateUser(@Param("id") id: string, @Body() body: UpdateuserDto) {
    //     return this.userService.update(parseInt(id), body);
    // }
}
