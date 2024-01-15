import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Field } from "./field.entity";
import { CreateFieldDto } from "./dtos/create-field.dto";
import { CreateFieldOnlyDto } from "./dtos/create-field-only.dto";
import { UpdateFieldDto } from "./dtos/update-field.dto";
import { Soil } from "../soil/soil.entity";

@Injectable()
export class FieldService {
  constructor(
    @InjectRepository(Field) private fieldRepository: Repository<Field>,
    @InjectRepository(Soil) private soilRepository: Repository<Soil>,
  ) {}

  async createFieldOnly(
    createFieldOnlyDto: CreateFieldOnlyDto,
  ): Promise<Field> {
    const { name, boundary } = createFieldOnlyDto;

    const newField = this.fieldRepository.create({
      name,
      boundary,
    });

    return this.fieldRepository.save(newField);
  }

  async createFieldWithSoil(createFieldDto: CreateFieldDto): Promise<Field> {
    try {
      const { name, boundary, soilName } = createFieldDto;

      // Check if the soil exists
      let soil = await this.soilRepository.findOne({
        where: { name: soilName },
      });

      // If the soil doesn't exist, create it
      if (!soil) {
        soil = await this.soilRepository.create({ name: soilName });
        await this.soilRepository.save(soil);
      }

      // Create the field and associate it with the soil
      const field = this.fieldRepository.create({
        name,
        boundary,
        soil,
      });

      await this.fieldRepository.save(field);

      // Return the created field
      return field;
    } catch (error) {
      console.error("Error creating field with soil:", error);
      throw error;
    }
  }

  // transformField and transformSoil -- use for findAllWithSoil and findById
  private transformField(field: Field): Field {
    return {
      id: field.id,
      name: field.name,
      boundary: field.boundary,
      created: field.created,
      updated: field.updated,
      deleted: field.deleted,
      soil: field.soil ? this.transformSoil(field.soil) : null,
      farm: field.farm,
    };
  }

  private transformSoil(soil: Soil): Soil {
    return {
      id: soil.id,
      name: soil.name,
      created: soil.created,
      updated: soil.updated,
      deleted: soil.deleted,
      fields: soil.fields || [],
    };
  }

  async findAllWithSoil() {
    const fields = await this.fieldRepository
      .createQueryBuilder("field")
      .leftJoinAndSelect("field.soil", "soil")
      .leftJoinAndSelect("field.farm", "farm")
      .where("field.deleted IS NULL")
      .getMany();

    return fields.map((field) => this.transformField(field));
  }

  async findById(id: string): Promise<Field> {
    try {
      const field = await this.fieldRepository
        .createQueryBuilder("field")
        .leftJoinAndSelect("field.soil", "soil")
        .leftJoinAndSelect("field.farm", "farm")
        .andWhere("field.id = :id", { id })
        .andWhere("field.deleted IS NULL")
        .getOne();

      if (!field) {
        throw new NotFoundException(`Field with ID ${id} not found`);
      }

      return this.transformField(field);
    } catch (error) {
      console.error("Error fetching field by ID:", error);
      throw error;
    }
  }

  async updateField(
    id: string,
    updateFieldDto: UpdateFieldDto,
  ): Promise<Field> {
    try {
      // console.log("Received ID:", id);
      // Find the field by ID
      const field = await this.fieldRepository.findOneOrFail({
        where: { id },
        relations: ["soil"],
      });

      // If soilName is provided, update the field's soil
      if (updateFieldDto.soilName) {
        // Check if the new soil exists
        let newSoil = await this.soilRepository.findOne({
          where: { name: updateFieldDto.soilName },
        });

        // If the new soil doesn't exist, create it
        if (!newSoil) {
          newSoil = await this.soilRepository.create({
            name: updateFieldDto.soilName,
          });
          await this.soilRepository.save(newSoil);
        }

        // Update the field's's soil
        field.soil = newSoil;
      }

      // Update field'name
      if (updateFieldDto.name) {
        field.name = updateFieldDto.name;
      }
      // Update the fields'boundary
      if (updateFieldDto.boundary) {
        field.boundary = updateFieldDto.boundary;
      }

      // Save the updated field
      const updatedField = await this.fieldRepository.save(field);

      // console.log("Updated Field:", updatedField);
      return updatedField;
    } catch (error) {
      console.error("Error updating field:", error);

      if (error instanceof NotFoundException) {
        throw new NotFoundException(`Field with ID ${id} not found`);
      }

      throw new Error("An error occurred while updating the field");
    }
  }

  async deleteFieldById(
    id: string,
  ): Promise<{ id: string; name: string; message: string }> {
    try {
      // findOneOrFail expects an object with a "where" property
      const field = await this.fieldRepository.findOneOrFail({ where: { id } });

      const { name } = field;

      // Soft delete by setting the "deleted" property
      field.deleted = new Date();
      await this.fieldRepository.save(field);
      return {
        id,
        name,
        message: `Successfully deleted Field with id ${id} and name ${name}`,
      };
    } catch (error) {
      throw new NotFoundException(`Field with id ${id} not found`);
    }
  }
}
