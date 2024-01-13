import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { validate } from "class-validator";
import { Soil } from "./soil.entity";
import { CreateSoilDto } from "./dtos/create-soil.dto";
import { UpdateSoilDto } from "./dtos/update-soil.dto";

@Injectable()
export class SoilService {
  constructor(
    @InjectRepository(Soil) private soilRepository: Repository<Soil>,
  ) {}

  async createSoil(createCropDto: CreateSoilDto): Promise<Soil> {
    const errors = await validate(createCropDto);

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    try {
      const { name } = createCropDto;
      const newCrop = this.soilRepository.create({ name });
      return await this.soilRepository.save(newCrop);
    } catch (error) {
      throw new BadRequestException("Error creating crop: " + error.message);
    }
  }

  async findAll(): Promise<Soil[]> {
    try {
      const soil = await this.soilRepository
        .createQueryBuilder("soil")
        .andWhere("soil.deleted IS NULL")
        .getMany();

      if (!soil.length) {
        throw new NotFoundException("No soil found");
      }

      return soil;
    } catch (error) {
      console.error("Error fetching soil:", error);
      throw error;
    }
  }

  async findById(id: string): Promise<Soil> {
    try {
      const soil = await this.soilRepository
        .createQueryBuilder("soil")
        .andWhere("soil.id = :id", { id })
        .andWhere("soil.deleted IS NULL")
        .getOne();

      if (!soil) {
        throw new NotFoundException(`Soil with ID ${id} not found`);
      }

      return soil;
    } catch (error) {
      console.error("Error fetching soil by ID:", error);
      throw error;
    }
  }

  async updateSoil(id: string, updateSoilDto: UpdateSoilDto): Promise<Soil> {
    try {
      const soil = await this.findById(id);

      if (updateSoilDto.name) {
        soil.name = updateSoilDto.name;
      }

      return await this.soilRepository.save(soil);
    } catch (error) {
      // console.error(`Error updating soil with ID ${id}:`, error);
      throw new NotFoundException("Failed to update soil");
    }
  }

  async deleteSoilById(
    id: string,
  ): Promise<{ id: string; name: string; message: string }> {
    try {
      // findOneOrFail expects an object with a "where" property
      const soil = await this.soilRepository.findOneOrFail({ where: { id } });

      const { name } = soil;
      // Soft delete by setting the "deleted" property
      soil.deleted = new Date();
      await this.soilRepository.save(soil);
      return {
        id,
        name,
        message: `Successfully deleted Soil with id ${id} and name ${name}`,
      };
    } catch (error) {
      throw new NotFoundException(`Soil with id ${id} not found`);
    }
  }
}
