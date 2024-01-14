import { Module } from "@nestjs/common";
import { CultivationTypeController } from "./cultivation-type.controller";
import { CultivationTypeService } from "./cultivation-type.service";

@Module({
  controllers: [CultivationTypeController],
  providers: [CultivationTypeService],
})
export class CultivationTypeModule {}
