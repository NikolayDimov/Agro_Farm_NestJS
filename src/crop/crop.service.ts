import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Crop } from "./crop.entity";
import { CreateCropDto } from "./dtos/create-crop.dto";
import { UpdateCropDto } from "./dtos/update-crop.dto";

@Injectable()
export class CropService {
  constructor(
    @InjectRepository(Crop) private cropRepository: Repository<Crop>,
  ) {}

  async createCrop(createCropDto: CreateCropDto): Promise<Crop> {
    const { name } = createCropDto;

    const newCrop = this.cropRepository.create({ name });
    return this.cropRepository.save(newCrop);
  }
  async findAll(): Promise<Crop[]> {
    try {
      const crop = await this.cropRepository
        .createQueryBuilder("crop")
        .andWhere("crop.deleted IS NULL")
        .getMany();

      if (!crop.length) {
        throw new NotFoundException("No crop found");
      }

      return crop;
    } catch (error) {
      console.error("Error fetching crop:", error);
      throw error;
    }
  }

  async findByName(name: string): Promise<Crop | undefined> {
    return this.cropRepository
      .createQueryBuilder("crop")
      .where("crop.name = :name", { name })
      .getOne();
  }

  async findById(id: string): Promise<Crop> {
    try {
      const crop = await this.cropRepository
        .createQueryBuilder("crop")
        .andWhere("crop.id = :id", { id })
        .andWhere("crop.deleted IS NULL")
        .getOne();

      if (!crop) {
        throw new NotFoundException(`Crop with ID ${id} not found`);
      }

      return crop;
    } catch (error) {
      console.error("Error fetching farm by ID:", error);
      throw error;
    }
  }

  async updateCrop(id: string, updateCropDto: UpdateCropDto): Promise<Crop> {
    const crop = await this.findById(id);

    if (updateCropDto.name) {
      crop.name = updateCropDto.name;
    }

    return this.cropRepository.save(crop);
  }

  async deleteCropById(id: string): Promise<void> {
    try {
      // findOneOrFail expects an object with a "where" property
      const farm = await this.cropRepository.findOneOrFail({ where: { id } });
      // Soft delete by setting the "deleted" property
      farm.deleted = new Date();
      await this.cropRepository.save(farm);
    } catch (error) {
      throw new NotFoundException(`Crop with id ${id} not found`);
    }
  }
}
