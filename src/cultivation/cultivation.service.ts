import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Cultivation } from "./cultivation.entity";
import { CreateCultivationDto } from "./dtos/create-cultivation.dto";
import { CreateCultivationOnlyDto } from "./dtos/create-cultivation-only.dto";
//import { UpdateCultivationDto } from "./dtos/update-cultivation.dto";
import { CultivationType } from "../cultivation-type/cultivation-type.entity";
import { Machine } from "../machine/machine.entity";
import { GrowingPeriod } from "../growing-period/growing-period.entity";

@Injectable()
export class CultivationService {
  constructor(
    @InjectRepository(Cultivation)
    private cultivationRepository: Repository<Cultivation>,
    @InjectRepository(GrowingPeriod)
    private growingPeriodRepository: Repository<GrowingPeriod>,
    @InjectRepository(CultivationType)
    private cultivationTypeRepository: Repository<CultivationType>,
    @InjectRepository(Machine)
    private machineRepository: Repository<Machine>,
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
    try {
      const { date, cultivationType, machine } = createCultivationDto;

      // Always create a new growing period
      const newGrowingPeriod = await this.growingPeriodRepository.create();
      await this.growingPeriodRepository.save(newGrowingPeriod);

      // Check if the cultivationType exists
      let cultivationTypeObj = await this.cultivationTypeRepository.findOne({
        where: { name: cultivationType },
      });

      // If the cultivationType doesn't exist, create it
      if (!cultivationTypeObj) {
        cultivationTypeObj = await this.cultivationTypeRepository.create({
          name: cultivationType,
        });
        await this.cultivationTypeRepository.save(cultivationTypeObj);
      }

      // Check if the machine exists
      let machineObj = await this.machineRepository.findOne({
        where: {
          brand: machine.brand,
          model: machine.model,
          registerNumber: machine.registerNumber,
        },
      });

      // If the machine doesn't exist, create it
      if (!machineObj) {
        machineObj = await this.machineRepository.create({
          brand: machine.brand,
          model: machine.model,
          registerNumber: machine.registerNumber,
        });
        await this.machineRepository.save(machineObj);
      }

      // Create the cultivation and associate it with the growing_period, cultivation_type, and machine
      const cultivation = this.cultivationRepository.create({
        date,
        growingPeriod: newGrowingPeriod,
        cultivationType: cultivationTypeObj,
        machine: machineObj,
      });

      await this.cultivationRepository.save(cultivation);

      // Return the created field
      return cultivation;
    } catch (error) {
      console.error(
        "Error creating cultivation with growing_period, cultivation_type, and machine:",
        error,
      );
      throw error;
    }
  }

  //   // transformField and transformSoil -- use for findAllWithSoil and findById
  //   private transformField(field: Field): Field {
  //     return {
  //       id: field.id,
  //       name: field.name,
  //       polygons: field.polygons,
  //       created: field.created,
  //       updated: field.updated,
  //       deleted: field.deleted,
  //       soil: field.soil ? this.transformSoil(field.soil) : null,
  //       farm: field.farm,
  //     };
  //   }

  //   private transformSoil(soil: Soil): Soil {
  //     return {
  //       id: soil.id,
  //       name: soil.name,
  //       created: soil.created,
  //       updated: soil.updated,
  //       deleted: soil.deleted,
  //       fields: soil.fields || [],
  //     };
  //   }

  //   async findAllWithSoil() {
  //     const fields = await this.fieldRepository
  //       .createQueryBuilder("field")
  //       .leftJoinAndSelect("field.soil", "soil")
  //       .leftJoinAndSelect("field.farm", "farm")
  //       .where("field.deleted IS NULL")
  //       .getMany();

  //     return fields.map((field) => this.transformField(field));
  //   }

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
