import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";
import { CreateUserDto } from "./create-user.dto";
const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

    // async signUp(email: string, password: string): Promise<{ access_token: string }>  {
    //     // Check if email is in use
    //     const users = await this.usersService.find(email);
    //     if (users.length) {
    //         throw new BadRequestException("email in use");
    //     }

    //     try {
    //         // Generate salt and hash password
    //         const salt = randomBytes(8).toString("hex");
    //         // - Hash the salt and password together
    //         const hash = (await scrypt(password, salt, 32)) as Buffer; // help Typescript to know what is hash
    //         // - Join the hashed result and the salt together
    //         const hashedPassword = salt + "." + hash.toString("hex");

    //         // Create and save the new user
    //         const user = await this.usersService.create(email, hashedPassword);

    //         // Generate JWT token for the new user
    //         const payload = { sub: user.id, username: user.email };
    //         const accessToken = await this.jwtService.signAsync(payload);

    //         // Return the user along with the access token
    //         return { access_token: accessToken };
    //     } catch (error) {
    //         // Handle cryptographic errors here
    //         throw new BadRequestException("Error creating user");
    //     }
    // }

    async signUp(user: CreateUserDto) {
        // See if email is in use
        const users = await this.usersService.find(user.email);
        if (users.length) {
            throw new BadRequestException("email in use");
        }

        // Hash the users password
        // - Generate the salt
        const salt = randomBytes(8).toString("hex");

        // - Hash the salt and password together
        const hash = (await scrypt(user.password, salt, 32)) as Buffer; // help Typescript to know what is hash

        // - Join the hashed result and the salt together
        const result = salt + "." + hash.toString("hex");

        // Create a new user and save it
        const userToCreate = await this.usersService.create(user.email, result);

        // return the user
        return userToCreate;
    }

    async signIn(user: CreateUserDto) {
        const [existingUser] = await this.usersService.find(user.email);
        // console.log(existingUser);
        if (!existingUser) {
            throw new NotFoundException("user not found");
        }
        //hashing the person's password
        const [salt, storedHash] = existingUser.password.split(".");
        // console.log('storedHash', storedHash);
        
        
        const hash = (await scrypt(user.password, salt, 32)) as Buffer;
        // console.log('enteredHash', hash.toString("hex"));

        if (storedHash !== hash.toString("hex")) {
            throw new BadRequestException("bad password");
        }

        const payload = { sub: existingUser.id, email: existingUser.email };
        // console.log('payload',payload);

        const token = { access_token: await this.jwtService.signAsync(payload) };
        // console.log('token',token);

        return token.access_token;
    }
}
