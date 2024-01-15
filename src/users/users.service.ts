import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { UserRole } from "../auth/dtos/role.enum";

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(username: string, email: string, password: string, role: UserRole) {
    const user = this.repo.create({ username, email, password, role });

    return this.repo.save(user);
    // with const user, then return user - Hooks are executed
    // there is console.log in terminal from user.entity
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.repo.findOne({ where: { username } });
  }

  find(username: string) {
    return this.repo.find({ where: { username } });
  }
}
