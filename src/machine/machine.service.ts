import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
//import { validate } from "class-validator";
import { Machine } from "./machine.entity";
import { CreateMachineDto } from "./dtos/create-machine.dto";
import { UpdateMachineDto } from "./dtos/update-machine.dto";
import { UserRole } from "../auth/dtos/role.enum";
import { FarmService } from "../farm/farm.service";

@Injectable()
export class MachineService {
  constructor(
    @InjectRepository(Machine) private machineRepository: Repository<Machine>,
    private farmService: FarmService,
  ) {}

  async createMachine(createMachineDto: CreateMachineDto): Promise<Machine> {
    const { brand, model, registerNumber, farmId } = createMachineDto;

    const farm = await this.farmService.findOne(farmId);

    if (!farm) {
      throw new BadRequestException("No machine found");
    }

    const machine = this.machineRepository.create({
      brand,
      model,
      registerNumber,
      farm: farm,
    });

    const createdMachine = await this.machineRepository.save(machine);
    return createdMachine;
  }

  async findOneByName(
    brand: string,
    model: string,
    registerNumber: string,
  ): Promise<Machine> {
    const machineName = await this.machineRepository.findOne({
      where: { brand, model, registerNumber },
    });
    return machineName;
  }

  async findOneById(id: string): Promise<Machine | undefined> {
    // const existingMachine = await this.machineRepository.findOne({
    //   where: { id },
    // });
    const existingMachine = await this.machineRepository.findOneBy({ id });

    if (!existingMachine) {
      throw new NotFoundException(`Machine with ID ${id} not found`);
    }

    return existingMachine;
  }

  async findOne(
    id: string,
    options?: { relations?: string[] },
  ): Promise<Machine> {
    if (!id) {
      return null;
    }

    return await this.machineRepository.findOne({
      where: { id },
      relations: options?.relations,
    });
  }

  async findAll(): Promise<Machine[]> {
    const machine = await this.machineRepository
      .createQueryBuilder("machine")
      .andWhere("machine.deleted IS NULL")
      .getMany();

    if (!machine.length) {
      throw new NotFoundException("No machines found");
    }

    return machine;
  }

  async findById(id: string): Promise<Machine> {
    const machine = await this.machineRepository
      .createQueryBuilder("machine")
      .andWhere("machine.id = :id", { id })
      .andWhere("machine.deleted IS NULL")
      .getOne();

    if (!machine) {
      throw new NotFoundException(`Machine with ID ${id} not found`);
    }

    return machine;
  }

  async updateMachine(
    id: string,
    updateMachineDto: UpdateMachineDto,
  ): Promise<Machine> {
    const machine = await this.machineRepository.findOneBy({ id });

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
  }

  async deleteMachineById(id: string): Promise<{
    id: string;
    brand: string;
    model: string;
    registerNumber: string;
    message: string;
  }> {
    const existingMachine = await this.machineRepository.findOneBy({ id });

    if (!existingMachine) {
      throw new NotFoundException(`Machine with id ${id} not found`);
    }

    const { brand, model, registerNumber } = existingMachine;

    // Soft delete using the softDelete method
    await this.machineRepository.softDelete({ id });

    return {
      id,
      brand,
      model,
      registerNumber,
      message: `Successfully soft-deleted Machine with id ${id}, Brand ${brand}, Model ${model} and Register Number ${registerNumber}`,
    };
  }

  async permanentlyDeleteMachineByIdForOwner(
    id: string,
    userRole: UserRole,
  ): Promise<{
    id: string;
    brand: string;
    model: string;
    registerNumber: string;
    message: string;
  }> {
    const existingMachine = await this.machineRepository.findOneBy({ id });
    const { brand, model, registerNumber } = existingMachine;
    // console.log("Found machine:", existingMachine);

    if (!existingMachine) {
      throw new NotFoundException(`Machine with id ${id} not found`);
    }

    // Check if the user has the necessary role (OWNER) to perform the permanent delete
    if (userRole !== UserRole.OWNER) {
      throw new NotFoundException("User does not have the required role");
    }

    // Perform the permanent delete
    await this.machineRepository.remove(existingMachine);

    return {
      id,
      brand,
      model,
      registerNumber,
      message: `Successfully permanently deleted Machine with id ${id}, Brand ${brand}, Model ${model} and Register Number ${registerNumber}`,
    };
  }
}
