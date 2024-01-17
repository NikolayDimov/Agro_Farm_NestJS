import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Cultivation } from "./cultivation.entity";
import { CreateCultivationDto } from "./dtos/create-cultivation.dto";
import { CreateCultivationOnlyDto } from "./dtos/create-cultivation-only.dto";
//import { UpdateCultivationDto } from "./dtos/update-cultivation.dto";
import { GrowingPeriodService } from "../growing-period/growing-period.service";
import { CultivationTypeService } from "../cultivation-type/cultivation-type.service";
import { MachineService } from "../machine/machine.service";

@Injectable()
export class CultivationService {
  constructor(
    @InjectRepository(Cultivation)
    private cultivationRepository: Repository<Cultivation>,
    private growingPeriodService: GrowingPeriodService,
    private cultivationTypeService: CultivationTypeService,
    private machineService: MachineService,
  ) {}

  async createCultivationOnly(
    createCultivationOnlyDto: CreateCultivationOnlyDto,
  ): Promise<Cultivation> {
    const newCultivation = this.cultivationRepository.create({
      date: createCultivationOnlyDto.date,
    });

    return this.cultivationRepository.save(newCultivation);
  }

  async createCultivationWithAttributes(
    createCultivationDto: CreateCultivationDto,
  ): Promise<Cultivation> {
    const { date, cultivationTypeId, machineId, growingPeriodId } =
      createCultivationDto;

    const growingPeriod = await this.growingPeriodService.findOne(
      growingPeriodId,
      { relations: ["field", "field.farm"] },
    );
    if (!growingPeriod) {
      throw new BadRequestException(
        `There is no growing period with id ${growingPeriodId}`,
      );
    }

    const cultivationType =
      await this.cultivationTypeService.findOne(cultivationTypeId);
    if (!cultivationTypeId) {
      throw new BadRequestException(
        `There is no cultivation type with id ${cultivationTypeId}`,
      );
    }

    const machine = await this.machineService.findOne(machineId, {
      relations: ["farm"],
    });
    if (!machine) {
      throw new BadRequestException(
        `There is no machine type with id ${machineId}`,
      );
    }
    console.log(machine);
    console.log(growingPeriod);
    console.log(cultivationType);

    if (machine.farm.id !== growingPeriod.field.farm.id) {
      throw new BadRequestException(
        `There is no machine with id ${machineId} in current farm`,
      );
    }

    // Create the cultivation and associate it with the growing_period, cultivation_type, and machine
    const cultivation = this.cultivationRepository.create({
      date,
      growingPeriod,
      cultivationType,
      machine,
    });

    const createdCultivation =
      await this.cultivationRepository.save(cultivation);

    // Return the created cultivation
    return createdCultivation;
  }

  // transformField and transformSoil -- use for findAllWithSoil and findById
  private transformCultivation(cultivationObj: Cultivation) {
    return {
      id: cultivationObj.id,
      date: cultivationObj.date,
      created: cultivationObj.created,
      updated: cultivationObj.updated,
      deleted: cultivationObj.deleted,
      growingPeriod: cultivationObj.growingPeriod,
      machine: cultivationObj.machine,
      cultivationType: cultivationObj.cultivationType,
    };
  }

  async findAllWithAttributes() {
    const cultivations = await this.cultivationRepository
      .createQueryBuilder("cultivation")
      .leftJoinAndSelect("cultivation.growingPeriod", "growingPeriod")
      .leftJoinAndSelect("cultivation.machine", "machine")
      .leftJoinAndSelect("cultivation.cultivationType", "cultivationType")
      .where("cultivation.deleted IS NULL")
      .getMany();

    return cultivations.map((cultivation) =>
      this.transformCultivation(cultivation),
    );
  }

  //   async findById(id: string): Promise<Field> {
  //     try {
  //       const field = await this.fieldRepository
  //         .createQueryBuilder("field")
  //         .leftJoinAndSelect("field.soil", "soil")
  //         .leftJoinAndSelect("field.farm", "farm")
  //         .andWhere("field.id = :id", { id })
  //         .andWhere("field.deleted IS NULL")
  //         .getOne();

  //       if (!field) {
  //         throw new NotFoundException(`Field with ID ${id} not found`);
  //       }

  //       return this.transformField(field);
  //     } catch (error) {
  //       console.error("Error fetching field by ID:", error);
  //       throw error;
  //     }
  //   }

  //   async updateField(
  //     id: string,
  //     updateFieldDto: UpdateFieldDto,
  //   ): Promise<Field> {
  //     try {
  //       // console.log("Received ID:", id);
  //       // Find the field by ID
  //       const field = await this.fieldRepository.findOneOrFail({
  //         where: { id },
  //         relations: ["soil"],
  //       });

  //       // If soilName is provided, update the field's soil
  //       if (updateFieldDto.soilName) {
  //         // Check if the new soil exists
  //         let newSoil = await this.soilRepository.findOne({
  //           where: { name: updateFieldDto.soilName },
  //         });

  //         // If the new soil doesn't exist, create it
  //         if (!newSoil) {
  //           newSoil = await this.soilRepository.create({
  //             name: updateFieldDto.soilName,
  //           });
  //           await this.soilRepository.save(newSoil);
  //         }

  //         // Update the field's's soil
  //         field.soil = newSoil;
  //       }

  //       // Update field'name
  //       if (updateFieldDto.name) {
  //         field.name = updateFieldDto.name;
  //       }
  //       // Update the fields'polygons
  //       if (updateFieldDto.polygons) {
  //         field.polygons = updateFieldDto.polygons;
  //       }

  //       // Save the updated field
  //       const updatedField = await this.fieldRepository.save(field);

  //       // console.log("Updated Field:", updatedField);
  //       return updatedField;
  //     } catch (error) {
  //       console.error("Error updating field:", error);

  //       if (error instanceof NotFoundException) {
  //         throw new NotFoundException(`Field with ID ${id} not found`);
  //       }

  //       throw new Error("An error occurred while updating the field");
  //     }
  //   }

  //   async deleteFieldById(
  //     id: string,
  //   ): Promise<{ id: string; name: string; message: string }> {
  //     try {
  //       // findOneOrFail expects an object with a "where" property
  //       const field = await this.fieldRepository.findOneOrFail({ where: { id } });

  //       const { name } = field;

  //       // Soft delete by setting the "deleted" property
  //       field.deleted = new Date();
  //       await this.fieldRepository.save(field);
  //       return {
  //         id,
  //         name,
  //         message: `Successfully deleted Field with id ${id} and name ${name}`,
  //       };
  //     } catch (error) {
  //       throw new NotFoundException(`Field with id ${id} not found`);
  //     }
  //   }
}
