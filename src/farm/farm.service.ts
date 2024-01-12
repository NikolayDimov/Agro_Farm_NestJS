import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Farm } from "./farm.entity";
import { CreateFarmDto } from "./dtos/create-farm.dto";
import { Country } from "../country/country.entity";

@Injectable()
export class FarmService {
  constructor(
    @InjectRepository(Farm) private farmRepository: Repository<Farm>,
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
  ) {}

  // Work with
  // {
  //     "name": "Farm Varna",
  //     "countryId": "a793df9e-660f-450c-ad09-7698d3703b73"
  //   }

  // async createFarm(createFarmDto: CreateFarmDto): Promise<Farm> {
  //     const { name, countryId } = createFarmDto;

  //     const isValidCountry = await this.validateCountryExistence(countryId);

  //     if (!isValidCountry) {
  //       throw new Error('Invalid countryId. Country does not exist.');
  //     }

  //     const newFarm = this.farmRepository.create({
  //       name,
  //       country: { id: countryId as unknown as number } as Country, // Explicit cast to handle the type discrepancy
  //     });

  //     return this.farmRepository.save(newFarm);
  //   }

  //   private async validateCountryExistence(countryId: string): Promise<boolean> {
  //     const country = await this.countryRepository.findOne({ where: { id: countryId as any } });
  //     return !!country;
  //   }

  async createFarm(createFarmDto: CreateFarmDto): Promise<Farm> {
    const { name, countryName } = createFarmDto;

    const country = await this.countryRepository.findOne({
      where: { name: countryName },
    });

    if (!country) {
      throw new Error(`Country with name ${countryName} not found.`);
    }

    const newFarm = this.farmRepository.create({
      name,
      country,
    });

    return this.farmRepository.save(newFarm);
  }

  async findAll(): Promise<Farm[]> {
    try {
      const farms = await this.farmRepository
        .createQueryBuilder("farm")
        .leftJoinAndSelect("farm.country", "country")
        .andWhere("farm.deleted IS NULL")
        .getMany();

      if (!farms.length) {
        throw new NotFoundException("No farms found");
      }

      console.log("Fetched Farms:", farms);

      return farms;
    } catch (error) {
      console.error("Error fetching farms:", error);
      throw error;
    }
  }

  async findById(id: string): Promise<Farm> {
    try {
      const farm = await this.farmRepository
        .createQueryBuilder("farm")
        .leftJoinAndSelect("farm.country", "country")
        .andWhere("farm.id = :id", { id })
        .andWhere("farm.deleted IS NULL")
        .getOne();

      if (!farm) {
        throw new NotFoundException(`Farm with ID ${id} not found`);
      }

      return farm;
    } catch (error) {
      console.error("Error fetching farm by ID:", error);
      throw error;
    }
  }

  async deleteFarmById(id: string): Promise<void> {
    try {
      // findOneOrFail expects an object with a "where" property
      const farm = await this.farmRepository.findOneOrFail({ where: { id } });

      // Soft delete by setting the "deleted" property
      farm.deleted = new Date();
      await this.farmRepository.save(farm);
    } catch (error) {
      throw new NotFoundException(`Farm with id ${id} not found`);
    }
  }
}
