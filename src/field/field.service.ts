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
}
