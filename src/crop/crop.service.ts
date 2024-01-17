import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { validate } from "class-validator";
import { Crop } from "./crop.entity";
import { CreateCropDto } from "./dtos/create-crop.dto";
import { UpdateCropDto } from "./dtos/update-crop.dto";
import { UserRole } from "../auth/dtos/role.enum";

@Injectable()
export class CropService {
  constructor(
    @InjectRepository(Crop) private cropRepository: Repository<Crop>,
  ) {}

  async createCrop(createCropDto: CreateCropDto): Promise<Crop> {
    const errors = await validate(createCropDto);

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    try {
      const { name } = createCropDto;
      const newCrop = this.cropRepository.create({ name });
      return await this.cropRepository.save(newCrop);
    } catch (error) {
      throw new BadRequestException("Error creating crop: " + error.message);
    }
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

  async findOne(id: string): Promise<Crop> {
    const existingCropId = await this.cropRepository.findOneBy({ id });
    return existingCropId;
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
    try {
      const crop = await this.cropRepository.findOneBy({ id });

      if (updateCropDto.name) {
        crop.name = updateCropDto.name;
      }

      return await this.cropRepository.save(crop);
    } catch (error) {
      // console.error(`Error updating crop with ID ${id}:`, error);
      throw new NotFoundException("Failed to update crop");
    }
  }

  async deleteCropById(
    id: string,
  ): Promise<{ id: string; name: string; message: string }> {
    try {
      const existingCrop = await this.cropRepository.findOneBy({ id });

      if (!existingCrop) {
        throw new NotFoundException(`Crop with id ${id} not found`);
      }

      // Soft delete using the softDelete method
      await this.cropRepository.softDelete({ id });

      return {
        id,
        name: existingCrop.name,
        message: `Successfully soft-deleted Farm with id ${id} and name ${existingCrop.name}`,
      };
    } catch (error) {
      throw new NotFoundException(`Crop with id ${id} not found`);
    }
  }

  async permanentlyDeleteCropByIdForOwner(
    id: string,
    userRole: UserRole,
  ): Promise<{ id: string; name: string; message: string }> {
    try {
      const existingCrop = await this.cropRepository.findOneBy({ id });

      if (!existingCrop) {
        throw new NotFoundException(`Crop with id ${id} not found`);
      }

      // Check if the user has the necessary role (OWNER) to perform the permanent delete
      if (userRole !== UserRole.OWNER) {
        throw new NotFoundException("User does not have the required role");
      }

      // Perform the permanent delete
      await this.cropRepository.remove(existingCrop);

      return {
        id,
        name: existingCrop.name,
        message: `Successfully permanently deleted Crop with id ${id} and name ${existingCrop.name}`,
      };
    } catch (error) {
      throw new NotFoundException(
        `Failed to permanently delete country with id ${id}`,
      );
    }
  }
}
