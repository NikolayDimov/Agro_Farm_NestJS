import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MachineController } from "./machine.controller";
import { MachineService } from "./machine.service";
import { Machine } from "./machine.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Machine])],
  controllers: [MachineController],
  providers: [MachineService],
})
export class MachineModule {}
