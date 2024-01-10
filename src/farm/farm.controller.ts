import { Controller, Post, Body, UseGuards, Patch, Param, Get, Query } from '@nestjs/common';
import { CreateFarmDto } from './dtos/create-farm.dto';
import { FarmService } from './farm.service';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../users/decorators/current-user.decorators';
import { User } from '../users/user.entity';
import { ReportDto } from './dtos/farm.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { AdminGuard } from '../guards/admin.guards';



@Controller('farm')
export class FarmController {
    constructor(private farmService: FarmService) {}


    @Post()
    @UseGuards(AuthGuard)
    @Serialize(ReportDto)
    createFarm(@Body() body: CreateFarmDto, @CurrentUser() user: User) {
        return this.farmService.create(body, user);
    }

    @Patch('/:id')
    @UseGuards(AdminGuard)
    @Serialize(ReportDto)
    updateFarm(@Body() body: CreateFarmDto, @CurrentUser() user: User) {
        return this.farmService.create(body, user);
    }
}
