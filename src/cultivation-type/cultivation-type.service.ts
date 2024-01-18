import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CultivationType } from "./cultivation-type.entity";
import { validate } from "class-validator";
import { CreateCultivationTypeDto } from "./dtos/create-cultivation-type.dto";
// import { UpdateCultivationTypeDto } from "./dtos/update-cultivation-type.dto";
// import { CultivationService } from "../cultivation/cultivation.service";

@Injectable()
export class CultivationTypeService {
  constructor(
    @InjectRepository(CultivationType)
    private cultivationTypeRepository: Repository<CultivationType>,
    //private cultivationService: CultivationService,
  ) {}

  async createCultivationType(
    createCultivationTypeDto: CreateCultivationTypeDto,
  ): Promise<CultivationType> {
    const errors = await validate(createCultivationTypeDto);

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    try {
      const { name } = createCultivationTypeDto;
      const newCultivationType = this.cultivationTypeRepository.create({
        name,
      });
      return await this.cultivationTypeRepository.save(newCultivationType);
    } catch (error) {
      throw new BadRequestException(
        "Error creating cultivation type: " + error.message,
      );
    }
  }

  async findOneByName(name: string): Promise<CultivationType> {
    const cultivationTypeName = await this.cultivationTypeRepository.findOne({
      where: { name },
    });
    return cultivationTypeName;
  }

  async findOne(
    id: string,
    options?: { relations?: string[] },
  ): Promise<CultivationType> {
    if (!id) {
      return null;
    }

    return await this.cultivationTypeRepository.findOne({
      where: { id },
      relations: options?.relations,
    });
  }

  // async updateCultivationType(
  //   id: string,
  //   updateCultivationTypeDto: UpdateCultivationTypeDto,
  // ): Promise<CultivationType> {
  //   const existingCultivationType =
  //     await this.cultivationTypeRepository.findOne({
  //       where: { id },
  //       relations: ["cultivations"],
  //     });

  //   if (
  //     existingCultivationType.cultivations &&
  //     existingCultivationType.cultivations.length > 0
  //   ) {
  //     // If there are associated cultivations, prevent changing the cultivationId
  //     if (
  //       updateCultivationTypeDto.cultivationId &&
  //       updateCultivationTypeDto.cultivationId !==
  //         existingCultivationType.cultivations[0].id
  //     ) {
  //       throw new BadRequestException(
  //         "This cultivation type has associated cultivations. Cannot update the cultivationId.",
  //       );
  //     }
  //   }

  //   // Update other fields if provided
  //   if (updateCultivationTypeDto.name !== undefined) {
  //     existingCultivationType.name = updateCultivationTypeDto.name;
  //   }

  //   // If the user provided a cultivationId, validate and update the cultivation
  //   if (updateCultivationTypeDto.cultivationId) {
  //     const cultivation = await this.cultivationService.findOne(
  //       updateCultivationTypeDto.cultivationId,
  //     );

  //     if (!cultivation) {
  //       throw new BadRequestException(
  //         "No cultivation found with the provided cultivationId",
  //       );
  //     }

  //     existingCultivationType.cultivations = [cultivation]; // Assign as an array
  //   }

  //   // Save and return the updated cultivation type
  //   return await this.cultivationTypeRepository.save(existingCultivationType);
  // }

  async deleteCultivationTypeById(id: string): Promise<{
    id: string;
    name: string;
    message: string;
  }> {
    const existingCultivationType =
      await this.cultivationTypeRepository.findOne({
        where: { id },
        relations: ["cultivations"],
      });

    if (!existingCultivationType) {
      throw new NotFoundException(`Machine with id ${id} not found`);
    }

    if (
      existingCultivationType.cultivations &&
      existingCultivationType.cultivations.length > 0
    ) {
      throw new BadRequestException(
        "This Cultivation Type has associated cultivations. Cannot be soft deleted.",
      );
    }

    // Soft delete using the softDelete method
    await this.cultivationTypeRepository.softDelete({ id });

    return {
      id,
      name: existingCultivationType.name,
      message: `Successfully permanently deleted Cultivation type with id ${id}, name ${existingCultivationType.name}`,
    };
  }
}
