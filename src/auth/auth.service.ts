import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";
import { CreateUserDto } from "./dtos/create-user.dto";
const scrypt = promisify(_scrypt);

import { SignInDto } from "./dtos/signIn.dto";

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

    async signUp(user: CreateUserDto) {
        // See if email is in use
        const users = await this.usersService.find(user.username);
        if (users.length) {
            throw new BadRequestException("username-name in use");
        }

        try {
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
                user.role // Use provided role or default to VIEWER
            );

            // return the user
            return userToCreate;
        } catch (error) {
            // Handle cryptographic errors here
            throw new BadRequestException("Error creating user");
        }
    }

    // async signIn(userLog: SignInDto) {
    //     try {
    //         const existingUser = await this.usersService.findOne(userLog.username);
    //         // console.log(existingUser);
    //         if (!existingUser) {
    //             throw new NotFoundException("user not found");
    //         }

    //         //hashing the person's password
    //         const [salt, storedHash] = existingUser.password.split(".");
    //         // console.log('storedHash', storedHash);

    //         const hash = (await scrypt(userLog.password, salt, 32)) as Buffer;
    //         // console.log('enteredHash', hash.toString("hex"));

    //         if (storedHash !== hash.toString("hex")) {
    //             throw new BadRequestException("bad password");
    //         }

    //         const payload = { sub: existingUser.id, username: existingUser.username };
    //         console.log("payload", payload);

    //         const token = { access_token: await this.jwtService.signAsync(payload) };
    //         console.log("token", token);

    //         return token;
    //     } catch (error) {
    //         // Handle cryptographic errors here
    //         throw new BadRequestException("Error creating user");
    //     }
    // }

    async signIn(userLog: SignInDto) {
        try {
            const { username, password } = userLog;
            const user = await this.usersService.findOne(username);

            if (!user) {
                throw new NotFoundException("User not found");
            }

            // Hash the entered password and compare it with the stored hashed password
            const [salt, storedHash] = user.password.split(".");
            const enteredHash = (await scrypt(password, salt, 32)) as Buffer;

            if (storedHash !== enteredHash.toString("hex")) {
                throw new UnauthorizedException("Invalid password");
            }

            const payload = { sub: user.id, username: user.username };

            return {
                access_token: await this.jwtService.signAsync(payload),
            };
        } catch (error) {
            // Handle cryptographic errors here
            throw new BadRequestException("Error creating user");
        }
    }


    
}
