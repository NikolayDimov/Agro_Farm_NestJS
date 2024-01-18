import { Module } from "@nestjs/common";
import { ReportService } from "./report.service";
import { ReportController } from "./report.controller";
import { FarmModule } from "../farm/farm.module";
import { CultivationModule } from "src/cultivation/cultivation.module";
import { GrowingPeriodModule } from "src/growing-period/growing-period.module";
import { FieldModule } from "src/field/field.module";

@Module({
  imports: [FarmModule, CultivationModule, GrowingPeriodModule, FieldModule],
  providers: [ReportService],
  controllers: [ReportController],
})
export class ReportModule {}
