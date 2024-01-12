import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FieldController } from "./field.controller";
import { FieldService } from "./field.service";
import { Field } from "./field.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Field])],
  controllers: [FieldController],
  providers: [FieldService],
})
export class FieldModule {}
