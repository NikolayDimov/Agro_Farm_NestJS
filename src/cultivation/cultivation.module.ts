import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CultivationController } from "./cultivation.controller";
import { CultivationService } from "./cultivation.service";
import { Cultivation } from "./cultivation.entity";
import { CultivationTypeModule } from "../cultivation-type/cultivation-type.module";
import { MachineModule } from "src/machine/machine.module";
import { GrowingPeriodModule } from "src/growing-period/growing-period.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Cultivation]),
    CultivationTypeModule,
    MachineModule,
    GrowingPeriodModule,
  ],
  controllers: [CultivationController],
  providers: [CultivationService],
})
export class CultivationModule {}
