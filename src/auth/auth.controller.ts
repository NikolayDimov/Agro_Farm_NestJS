import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Request,
  //Patch,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthGuard } from "./auth.guard";
import { CreateUserDto } from "./dtos/create-user.dto";
import { SignInDto } from "./dtos/signIn.dto";

@Controller("auth")
// @Serialize(UserDto)  -> not used
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post("login")
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Post("/register")
  async createUser(@Body() user: CreateUserDto) {
    const userCreate = await this.authService.signUp(user); // creating User with authentication
    return userCreate;
  }

  @UseGuards(AuthGuard)
  @Get("/profile")
  getProfile(@Request() req) {
    return req.user;
  }

  //   @Patch('/:id')
  // update Param (id) new ParseUUID

  // LOGOUT NOT WORK IN BACK-END
  // @UseGuards(AuthGuard)
  // @Post("logout")
  // logout(@Res() res: Response): void {
  //   const cookieName = "your_custom_cookie_name"; // Replace with your custom cookie name

  //   // Clear the custom cookie on the server side (assuming you're using cookies)
  //   res.clearCookie(cookieName);

  //   // Send a response indicating a successful logout
  //   res.status(HttpStatus.OK).json({ message: "Logout successful" });
  // }
}

// FOR FRONT-END
// auth.service.ts (Angular example)
// import { Injectable } from "@angular/core";

// @Injectable({
//   providedIn: "root",
// })
// export class AuthService {
//   private token: string | null = null;

//   login(token: string): void {
//     this.token = token;
//   }

//   logout(): void {
//     this.token = null;
//   }

//   getToken(): string | null {
//     return this.token;
//   }
// }
