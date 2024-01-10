import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Farm } from './farm.entity';
import { CreateReportDto } from './dtos/create-farm.dto';
import { User } from '../users/user.entity';


@Injectable()
export class FarmService {
    constructor(@InjectRepository(Farm) private repo: Repository<Farm>) {}


    create(reportDto: CreateReportDto, user: User) {
        const report = this.repo.create(reportDto);
        report.user = user;
        return this.repo.save(report);
    }
}
