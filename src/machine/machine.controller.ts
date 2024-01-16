import {
  Controller,
  UseGuards,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  NotFoundException,
} from "@nestjs/common";
import { AuthGuard } from "../auth/guards/auth.guard";
import { CreateMachineDto } from "./dtos/create-machine.dto";
import { MachineService } from "./machine.service";
import { UpdateMachineDto } from "./dtos/update-machine.dto";

@Controller("machine")
@UseGuards(AuthGuard)
export class MachineController {
  constructor(private machineService: MachineService) {}

  @Post("/createMachine")
  async createMachine(@Body() createMachineDto: CreateMachineDto) {
    try {
      return this.machineService.createMachine(createMachineDto);
    } catch (error) {
      console.error("Error creating machine:", error);
      throw new NotFoundException("Failed to create machine");
    }
  }

  @Get("getAll")
  async getAllMachines() {
    try {
      const machines = await this.machineService.findAll();
      return { data: machines };
    } catch (error) {
      console.error("Error fetching all machines:", error);
      throw new NotFoundException("Failed to fetch machines");
    }
  }

  @Get(":id")
  async getMachineById(@Param("id") id: string) {
    try {
      const machine = await this.machineService.findById(id);

      if (!machine) {
        throw new NotFoundException("Machine not found");
      }

      return { data: machine };
    } catch (error) {
      console.error("Error fetching machine by ID:", error);
      throw new NotFoundException("Machine not found");
    }
  }

  @Patch(":id")
  async updateMachine(
    @Param("id") id: string,
    @Body() updateMachineDto: UpdateMachineDto,
  ) {
    try {
      return this.machineService.updateMachine(id, updateMachineDto);
    } catch (error) {
      console.error("Error updating machine:", error);
      throw new NotFoundException("Failed to update machine");
    }
  }

  @Delete(":id")
  async deleteMachineById(@Param("id") id: string): Promise<{
    id: string;
    brand: string;
    model: string;
    registerNumber: string;
    message: string;
  }> {
    try {
      return this.machineService.deleteMachineById(id);
    } catch (error) {
      console.error("Error deleting machine:", error);
      throw new NotFoundException("Failed to delete machine");
    }
  }
}

// When you use return with a promise inside an asynchronous function, the function automatically returns a promise that will be resolved with the value returned from the asynchronous operation. Here's the corrected explanation:
