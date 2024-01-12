import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FarmController } from "./farm.controller";
import { FarmService } from "./farm.service";
import { Farm } from "./farm.entity";
import { CountryModule } from "../country/country.module";
import { CountryService } from "../country/country.service";

@Module({
  imports: [TypeOrmModule.forFeature([Farm]), CountryModule],
  controllers: [FarmController],
  providers: [FarmService, CountryService],
})
export class FarmModule {}
