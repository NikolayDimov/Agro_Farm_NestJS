import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
  // ExecutionContext,
} from "@nestjs/common";
// import { InjectRepository } from "@nestjs/typeorm";
// import { Repository } from "typeorm";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";
import { CreateUserDto } from "./dtos/create-user.dto";
const scrypt = promisify(_scrypt);
import { SignInDto } from "./dtos/signIn.dto";
import { User } from "../users/user.entity";
import { UpdateUserRoleDto } from "./dtos/update-user-role.dto";
//import { UserRole } from "./dtos/role.enum";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(user: CreateUserDto) {
    const users = await this.usersService.find(user.username);

    if (users.length) {
      throw new BadRequestException("username-name in use");
    }

    try {
      // Set the default role to VIEWER if not provided  ---// NO NEED is set in create.user.dto
      // user.role = user.role || UserRole.VIEWER;

      // Hash the users password
      // - Generate the salt
      const salt = randomBytes(8).toString("hex");
      // - Hash the salt and password together
      const hash = (await scrypt(user.password, salt, 32)) as Buffer; // help Typescript to know what is hash
      // - Join the hashed result and the salt together
      const resultHashPass = salt + "." + hash.toString("hex");
      // Create a new user and save it
      const userToCreate = await this.usersService.create(
        user.username,
        user.email,
        resultHashPass,
        user.role,
      );

      return userToCreate;
    } catch (error) {
      throw new BadRequestException("Email is already use!");
    }
  }

  async signIn(userLog: SignInDto) {
    try {
      const { username, password } = userLog;
      const existingUser = await this.usersService.findOne(username);

      if (!existingUser) {
        throw new NotFoundException("User not found");
      }

      // Hash the entered password and compare it with the stored hashed password
      const [salt, storedHash] = existingUser.password.split(".");
      const enteredHash = (await scrypt(password, salt, 32)) as Buffer;

      if (storedHash !== enteredHash.toString("hex")) {
        throw new UnauthorizedException("Invalid password");
      }

      const payload = {
        sub: existingUser.id,
        username: existingUser.username,
        role: existingUser.role,
      };

      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      throw new BadRequestException("Error user login");
    }
  }

  async updateUserRole(updateUserRoleDto: UpdateUserRoleDto): Promise<User> {
    const { userId, newRole } = updateUserRoleDto;

    const existingUser = await this.usersService.findOneById(userId);

    if (!existingUser) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    existingUser.role = newRole;
    //await this.usersService.create(existingUser);
    await this.usersService.update(existingUser);

    return existingUser;
  }
}
