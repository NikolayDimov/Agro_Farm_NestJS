import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CultivationTypeController } from "./cultivation-type.controller";
import { CultivationTypeService } from "./cultivation-type.service";
import { CultivationType } from "./cultivation-type.entity";

@Module({
  imports: [TypeOrmModule.forFeature([CultivationType])],
  controllers: [CultivationTypeController],
  providers: [CultivationTypeService],
  exports: [
    TypeOrmModule.forFeature([CultivationType]),
    CultivationTypeService,
  ],
})
export class CultivationTypeModule {}
