import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { GrowingPeriod } from "./growing-period.entity";
import { CreateGrowingPeriodDto } from "./dtos/create-growing-period.dto";
import { FieldService } from "../field/field.service";
import { CropService } from "../crop/crop.service";
//import { v4 as uuidv4 } from "uuid";

@Injectable()
export class GrowingPeriodService {
  constructor(
    @InjectRepository(GrowingPeriod)
    private growingPeriodRepository: Repository<GrowingPeriod>,
    private fieldService: FieldService,
    private cropService: CropService,
  ) {}

  async createGrowingPeriod(
    createGrowingPeriodDto?: Partial<CreateGrowingPeriodDto>,
  ): Promise<GrowingPeriod> {
    createGrowingPeriodDto = createGrowingPeriodDto || {}; // Provide a default value if undefined

    const { fieldId, cropId } = createGrowingPeriodDto;

    if (!fieldId || !cropId) {
      throw new Error(
        "fieldId and cropId are required in createGrowingPeriodDto",
      );
    }

    const field = await this.fieldService.findOneById(fieldId);
    const crop = await this.cropService.findOne(cropId);

    if (!field || !crop) {
      const notFoundEntity = !field
        ? `Field with id ${fieldId}`
        : `Crop with id ${cropId}`;
      throw new NotFoundException(`${notFoundEntity} not found`);
    }

    const growingPeriod = this.growingPeriodRepository.create({
      field,
      crop,
    });

    return this.growingPeriodRepository.save(growingPeriod);
  }

  async findOne(
    id: string,
    options?: { relations?: string[] },
  ): Promise<GrowingPeriod> {
    if (!id) {
      return null;
    }

    return await this.growingPeriodRepository.findOne({
      where: { id },
      relations: options?.relations,
    });
  }

  async findOneById(id: string): Promise<GrowingPeriod> {
    const existingField = await this.growingPeriodRepository.findOne({
      where: { id },
    });
    return existingField;
  }
}
