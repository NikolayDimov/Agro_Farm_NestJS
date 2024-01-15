import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GrowingPeriodController } from "./growing-period.controller";
import { GrowingPeriodService } from "./growing-period.service";
import { GrowingPeriod } from "./growing-period.entity";

@Module({
  imports: [TypeOrmModule.forFeature([GrowingPeriod])],
  controllers: [GrowingPeriodController],
  providers: [GrowingPeriodService],
  exports: [TypeOrmModule],
})
export class GrowingPeriodModule {}
