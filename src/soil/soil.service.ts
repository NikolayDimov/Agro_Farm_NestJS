import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Soil } from "./soil.entity";
import { CreateSoilDto } from "./dtos/create-soil.dto";

@Injectable()
export class SoilService {
  constructor(
    @InjectRepository(Soil) private soilRepository: Repository<Soil>,
  ) {}

  async createSoil(createSoilDto: CreateSoilDto): Promise<Soil> {
    const { name } = createSoilDto;

    const newSoil = this.soilRepository.create({ name });

    return this.soilRepository.save(newSoil);
  }

  async findAll(): Promise<Soil[]> {
    return this.soilRepository.find();
  }

  async findById(id: string): Promise<Soil> {
    try {
      const soil = await this.soilRepository
        .createQueryBuilder("soil")
        .andWhere("soil.id = :id", { id })
        .andWhere("soil.deleted IS NULL")
        .getOne();

      if (!soil) {
        throw new NotFoundException(`Farm with ID ${id} not found`);
      }

      return soil;
    } catch (error) {
      console.error("Error fetching farm by ID:", error);
      throw error;
    }
  }

  async deleteSoilById(id: string): Promise<void> {
    try {
      // findOneOrFail expects an object with a "where" property
      const soil = await this.soilRepository.findOneOrFail({ where: { id } });

      // Soft delete by setting the "deleted" property
      soil.deleted = new Date();
      await this.soilRepository.save(soil);
    } catch (error) {
      throw new NotFoundException(`Farm with id ${id} not found`);
    }
  }
}
