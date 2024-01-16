import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { UserRole } from "../auth/dtos/role.enum";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  create(username: string, email: string, password: string, role: UserRole) {
    const user = this.userRepository.create({
      username,
      email,
      password,
      role,
    });

    return this.userRepository.save(user);
  }

  async findOne(username: string): Promise<User | undefined> {
    // return this.userRepository.findOne({ where: { username } });
    return await this.userRepository.findOneBy({ username });
  }

  async find(username: string) {
    return this.userRepository.find({ where: { username } });
  }
}
