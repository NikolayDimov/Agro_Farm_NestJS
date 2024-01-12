import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Field } from "./field.entity";
import { CreateFieldDto } from "./dtos/create-field.dto";

@Injectable()
export class FieldService {
  constructor(
    @InjectRepository(Field) private fieldRepository: Repository<Field>,
  ) {}

  async createField(createFieldDto: CreateFieldDto): Promise<Field> {
    const { name, polygons } = createFieldDto;

    const newField = this.fieldRepository.create({
      name,
      polygons,
    });

    return this.fieldRepository.save(newField);
  }

  async findAll(): Promise<Field[]> {
    try {
      const field = await this.fieldRepository
        .createQueryBuilder("field")
        .andWhere("field.deleted IS NULL")
        .getMany();

      if (!field.length) {
        throw new NotFoundException("No farms found");
      }

      console.log("Fetched Farms:", field);

      return field;
    } catch (error) {
      console.error("Error fetching farms:", error);
      throw error;
    }
  }

  async getAllFieldsWithDetails(): Promise<Field[]> {
    return this.fieldRepository
      .createQueryBuilder("field")
      .leftJoinAndSelect("field.soil", "soil")
      .leftJoinAndSelect("field.farm", "farm")
      .select([
        "field.id",
        "field.name",
        "field.created",
        "field.updated",
        "field.deleted",
        "soil.name",
        "farm.name",
      ])
      .getMany();
  }

  async findById(id: string): Promise<Field> {
    try {
      const field = await this.fieldRepository
        .createQueryBuilder("field")
        .andWhere("field.id = :id", { id })
        .andWhere("field.deleted IS NULL")
        .getOne();

      if (!field) {
        throw new NotFoundException(`Farm with ID ${id} not found`);
      }

      return field;
    } catch (error) {
      console.error("Error fetching farm by ID:", error);
      throw error;
    }
  }

  async deleteFieldById(id: string): Promise<void> {
    try {
      // findOneOrFail expects an object with a "where" property
      const farm = await this.fieldRepository.findOneOrFail({ where: { id } });

      // Soft delete by setting the "deleted" property
      farm.deleted = new Date();
      await this.fieldRepository.save(farm);
    } catch (error) {
      throw new NotFoundException(`Farm with id ${id} not found`);
    }
  }
}
