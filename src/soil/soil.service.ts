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
import { UserRole } from "../auth/dtos/role.enum";

@Injectable()
export class SoilService {
  constructor(
    @InjectRepository(Soil) private soilRepository: Repository<Soil>,
  ) {}

  async createSoil(createSoilDto: CreateSoilDto): Promise<Soil> {
    const errors = await validate(createSoilDto);

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    try {
      const { name } = createSoilDto;
      const newSoil = this.soilRepository.create({ name });
      return await this.soilRepository.save(newSoil);
    } catch (error) {
      throw new BadRequestException("Error creating soil: " + error.message);
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

  async findOneByName(name: string): Promise<Soil> {
    try {
      const soil = await this.soilRepository.findOne({ where: { name } });
      return soil;
    } catch (error) {
      console.error("Error fetching soil by name:", error);
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
      const soil = await this.soilRepository.findOneBy({ id });

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
      const existingSoil = await this.soilRepository.findOneBy({ id });

      if (!existingSoil) {
        throw new NotFoundException(`Country with id ${id} not found`);
      }

      // Soft delete using the softDelete method
      await this.soilRepository.softDelete({ id });
      //await this.countryRepository.softRemove({ id });

      return {
        id,
        name: existingSoil.name,
        message: `Successfully soft-deleted Soil with id ${id} and name ${existingSoil.name}`,
      };
    } catch (error) {
      throw new NotFoundException(`Soil with id ${id} not found`);
    }
  }

  async permanentlyDeleteSoilByIdForOwner(
    id: string,
    userRole: UserRole,
  ): Promise<{ id: string; name: string; message: string }> {
    try {
      const existingSoil = await this.soilRepository.findOneBy({ id });

      if (!existingSoil) {
        throw new NotFoundException(`Soil with id ${id} not found`);
      }

      // Check if the user has the necessary role (OWNER) to perform the permanent delete
      if (userRole !== UserRole.OWNER) {
        throw new NotFoundException("User does not have the required role");
      }

      // Perform the permanent delete
      await this.soilRepository.remove(existingSoil);

      return {
        id,
        name: existingSoil.name,
        message: `Successfully permanently deleted Soil with id ${id} and name ${existingSoil.name}`,
      };
    } catch (error) {
      throw new NotFoundException(
        `Failed to permanently delete Soil with id ${id}`,
      );
    }
  }
}
