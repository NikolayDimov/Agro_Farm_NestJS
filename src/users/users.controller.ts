import { Controller } from "@nestjs/common";
import { UsersService } from "./users.service";
import { AuthService } from "../auth/auth.service";

@Controller()
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}
}
