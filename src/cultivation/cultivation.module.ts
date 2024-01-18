import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CultivationController } from "./cultivation.controller";
import { Cultivation } from "./cultivation.entity";
import { CultivationTypeModule } from "../cultivation-type/cultivation-type.module";
import { MachineModule } from "src/machine/machine.module";
import { GrowingPeriodModule } from "src/growing-period/growing-period.module";
import { CultivationService } from "./cultivation.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Cultivation]),
    CultivationTypeModule,
    MachineModule,
    GrowingPeriodModule,
  ],
  controllers: [CultivationController],
  providers: [CultivationService],
  exports: [TypeOrmModule.forFeature([Cultivation]), CultivationService],
})
export class CultivationModule {}
