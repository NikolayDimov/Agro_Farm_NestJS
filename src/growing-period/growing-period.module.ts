import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GrowingPeriodController } from "./growing-period.controller";
import { GrowingPeriodService } from "./growing-period.service";
import { GrowingPeriod } from "./growing-period.entity";
import { FieldModule } from "../field/field.module";
import { CropModule } from "../crop/crop.module";

@Module({
  imports: [TypeOrmModule.forFeature([GrowingPeriod]), FieldModule, CropModule],
  controllers: [GrowingPeriodController],
  providers: [GrowingPeriodService],
  exports: [TypeOrmModule.forFeature([GrowingPeriod]), GrowingPeriodService],
})
export class GrowingPeriodModule {}
