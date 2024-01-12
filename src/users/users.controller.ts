import { Controller } from "@nestjs/common";
import { UsersService } from "./users.service";
import { Serialize } from "../interceptors/serialize.interceptor";
import { UserDto } from "../auth/dtos/user.dto";
import { AuthService } from "../auth/auth.service";

@Controller()
@Serialize(UserDto) // no password return for user
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}
}
