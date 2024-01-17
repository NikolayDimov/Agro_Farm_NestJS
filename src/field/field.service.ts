import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Field } from "./field.entity";
import { CreateFieldDto } from "./dtos/create-field.dto";
import { CreateFieldOnlyDto } from "./dtos/create-field-only.dto";
import { UpdateFieldDto } from "./dtos/update-field.dto";
import { Soil } from "../soil/soil.entity";
import { UserRole } from "../auth/dtos/role.enum";
import { SoilService } from "../soil/soil.service";
import { FarmService } from "../farm/farm.service";
import { CreateFieldWithSoilIdDto } from "./dtos/create-fieldWithSoilId.dto";

@Injectable()
export class FieldService {
  constructor(
    @InjectRepository(Field) private fieldRepository: Repository<Field>,
    private soilService: SoilService,
    private farmService: FarmService,
  ) {}

  async createFieldOnly(
    createFieldOnlyDto: CreateFieldOnlyDto,
  ): Promise<Field> {
    const { name, boundary } = createFieldOnlyDto;

    const newField = this.fieldRepository.create({
      name,
      boundary,
    });

    const createdField = this.fieldRepository.save(newField);
    return createdField;
  }

  async createFieldWithSoil(createFieldDto: CreateFieldDto): Promise<Field> {
    const { name, boundary, soilName, farmId } = createFieldDto;

    // Check if the soil exists
    let soil = await this.soilService.findOneByName(soilName);

    // If the soil doesn't exist, create it
    if (!soil) {
      soil = await this.soilService.createSoil({ name: soilName });
    }

    const farm = await this.farmService.findOneById(farmId);
    if (!farm) {
      throw new BadRequestException(`No farm with ${farm.id}`);
    }

    // Create the field and associate it with the soil
    const field = this.fieldRepository.create({
      name,
      boundary,
      soil,
      farm,
    });

    const createdField = await this.fieldRepository.save(field);
    // Return the created field
    return createdField;
  }

  async createFieldWithSoilId(
    createFieldWithSoilIdDto: CreateFieldWithSoilIdDto,
  ): Promise<Field> {
    const { name, boundary, soilId, farmId } = createFieldWithSoilIdDto;

    // Check if the soil exists
    let soil = await this.soilService.findOne(soilId);

    // If the soil doesn't exist, create it
    if (!soil) {
      soil = await this.soilService.createSoilId({ id: soilId });
    }

    const farm = await this.farmService.findOneById(farmId);
    if (!farm) {
      throw new BadRequestException(`No farm with ${farm.id}`);
    }

    // Create the field and associate it with the soil
    const field = this.fieldRepository.create({
      name,
      boundary,
      soil,
      farm,
    });

    const createdField = await this.fieldRepository.save(field);
    // Return the created field
    return createdField;
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
      growingPeriods: field.growingPeriods,
    };
  }

  //The transformSoil function allows selectively include or exclude certain properties of the Soil entity in the transformed output.
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

  async findOne(id: string): Promise<Field> {
    const existingFieldId = await this.fieldRepository.findOneBy({ id });
    return existingFieldId;
  }

  async findOneById(id: string): Promise<Field> {
    const existingField = await this.fieldRepository.findOne({ where: { id } });
    return existingField;
  }

  async findById(id: string): Promise<Field> {
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
  }

  async updateField(
    id: string,
    updateFieldDto: UpdateFieldDto,
  ): Promise<Field> {
    // console.log("Received ID:", id);
    // Find the field by ID
    const field = await this.fieldRepository.findOne({
      where: { id },
      relations: ["soil"],
    });

    // If soilName is provided, update the field's soil
    if (updateFieldDto.soilName) {
      // Check if the new soil exists
      let newSoil = await this.soilService.findOneByName(
        updateFieldDto.soilName, // Corrected from soilName to updateFieldDto.soilName
      );

      // If the new soil doesn't exist, create it
      if (!newSoil) {
        newSoil = await this.soilService.createSoil({
          name: updateFieldDto.soilName,
        });
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
  }

  async deleteFieldById(
    id: string,
  ): Promise<{ id: string; name: string; message: string }> {
    const existingField = await this.fieldRepository.findOneBy({ id });

    if (!existingField) {
      throw new NotFoundException(`Field with id ${id} not found`);
    }

    // Soft delete using the softDelete method
    await this.fieldRepository.softDelete({ id });

    return {
      id,
      name: existingField.name,
      message: `Successfully soft-deleted Field with id ${id} and name ${existingField.name}`,
    };
  }

  async permanentlyDeleteFieldByIdForOwner(
    id: string,
    userRole: UserRole,
  ): Promise<{ id: string; name: string; message: string }> {
    const existingField = await this.fieldRepository.findOneBy({ id });

    if (!existingField) {
      throw new NotFoundException(`Field with id ${id} not found`);
    }

    // Check if the user has the necessary role (OWNER) to perform the permanent delete
    if (userRole !== UserRole.OWNER) {
      throw new NotFoundException("User does not have the required role");
    }

    // Perform the permanent delete
    await this.fieldRepository.remove(existingField);

    return {
      id,
      name: existingField.name,
      message: `Successfully permanently deleted Field with id ${id} and name ${existingField.name}`,
    };
  }
}
