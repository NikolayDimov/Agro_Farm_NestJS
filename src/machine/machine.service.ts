import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { validate } from "class-validator";
import { Machine } from "./machine.entity";
import { CreateMachineDto } from "./dtos/create-machine.dto";
import { UpdateMachineDto } from "./dtos/update-machine.dto";

@Injectable()
export class MachineService {
  constructor(
    @InjectRepository(Machine) private machineRepository: Repository<Machine>,
  ) {}

  async createMachine(createMachineDto: CreateMachineDto): Promise<Machine> {
    const errors = await validate(createMachineDto);

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    try {
      const { brand, model, registerNumber } = createMachineDto;
      const newMachine = this.machineRepository.create({
        brand,
        model,
        registerNumber,
      });
      return await this.machineRepository.save(newMachine);
    } catch (error) {
      throw new BadRequestException("Error creating crop: " + error.message);
    }
  }

  async findAll(): Promise<Machine[]> {
    try {
      const machine = await this.machineRepository
        .createQueryBuilder("machine")
        .andWhere("machine.deleted IS NULL")
        .getMany();

      if (!machine.length) {
        throw new NotFoundException("No machines found");
      }

      return machine;
    } catch (error) {
      console.error("Error fetching machines:", error);
      throw error;
    }
  }

  async findById(id: string): Promise<Machine> {
    try {
      const machine = await this.machineRepository
        .createQueryBuilder("machine")
        .andWhere("machine.id = :id", { id })
        .andWhere("machine.deleted IS NULL")
        .getOne();

      if (!machine) {
        throw new NotFoundException(`Machine with ID ${id} not found`);
      }

      return machine;
    } catch (error) {
      console.error("Error fetching machine by ID:", error);
      throw error;
    }
  }

  async updateMachine(
    id: string,
    updateMachineDto: UpdateMachineDto,
  ): Promise<Machine> {
    try {
      const machine = await this.findById(id);

      if (
        updateMachineDto.brand ||
        updateMachineDto.model ||
        updateMachineDto.registerNumber
      ) {
        if (updateMachineDto.brand) {
          machine.brand = updateMachineDto.brand;
        }

        if (updateMachineDto.model) {
          machine.model = updateMachineDto.model;
        }

        if (updateMachineDto.registerNumber) {
          machine.registerNumber = updateMachineDto.registerNumber;
        }
      }

      return await this.machineRepository.save(machine);
    } catch (error) {
      // console.error(`Error updating machine with ID ${id}:`, error);
      throw new NotFoundException("Failed to update machine");
    }
  }

  async deleteMachineById(id: string): Promise<{
    id: string;
    brand: string;
    model: string;
    registerNumber: string;
    message: string;
  }> {
    try {
      // findOneOrFail expects an object with a "where" property
      const machine = await this.machineRepository.findOneOrFail({
        where: { id },
      });

      const { brand, model, registerNumber } = machine;
      // Soft delete by setting the "deleted" property
      machine.deleted = new Date();
      await this.machineRepository.save(machine);
      return {
        id,
        brand,
        model,
        registerNumber,
        message: `Successfully deleted Machine with id ${id} and brand ${brand}`,
      };
    } catch (error) {
      throw new NotFoundException(`Machine with id ${id} not found`);
    }
  }
}
