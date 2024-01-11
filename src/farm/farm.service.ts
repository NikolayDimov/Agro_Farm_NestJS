import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Farm } from './farm.entity';
import { CreateFarmDto } from './dtos/create-farm.dto';
// import { User } from '../users/user.entity';


@Injectable()
export class FarmService {
    constructor(@InjectRepository(Farm) private repo: Repository<Farm>) {}


    //create(farmDto: CreateFarmDto, user: User) {  // with farm-user connection
    create(farmDto: CreateFarmDto) {
        const farm = this.repo.create(farmDto);
        //farm.user = user;
        return this.repo.save(farm);
    }
}
