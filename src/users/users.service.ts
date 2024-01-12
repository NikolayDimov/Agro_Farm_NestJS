import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { UserRole } from "../auth/dtos/enum";

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(username: string, email: string, password: string, role: UserRole) {
    const user = this.repo.create({ username, email, password, role });

    return this.repo.save(user);
    // with const user, then return user - Hooks are executed
    // there is console.log in terminal from user.entity
  }

  // async findOne(username: string): Promise<User | undefined> {
  //   return this.users.find((user) => user.username === username);
  // }

  // findOne(id: number) {
  //   if (!id) {
  //     return null;
  //   }
  //   return this.repo.findOneBy({ id });
  // }

  async findOne(username: string): Promise<User | undefined> {
    return this.repo.findOne({ where: { username } });
  }

  // find(email: string) {
  // 	return this.repo.find({ where: { email } });
  // }

  find(username: string) {
    return this.repo.find({ where: { username } });
  }

  // async update(id: number, attributes: Partial<User>) {
  // 	const user = await this.findOne(id);
  // 	if(!user) {
  // 		throw new NotFoundException('user not found');
  // 	}
  // 	Object.assign(user, attributes);

  // 	return this.repo.save(user);
  // }

  // async remove(id: number) {
  // 	const user = await this.findOne(id);
  // 	if(!user) {
  // 		throw new NotFoundException('user not found');
  // 	}
  // 	return this.repo.remove(user);
  // }
}
