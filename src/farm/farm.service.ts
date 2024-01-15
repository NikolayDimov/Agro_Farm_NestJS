import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Farm } from "./farm.entity";
import { CreateFarmDto } from "./dtos/create-farm.dto";
import { CreateFarmOnlyDto } from "./dtos/create-farm-only.dto";
import { UpdateFarmDto } from "./dtos/update-farm.dto";
import { Country } from "../country/country.entity";
// import { Field } from "../field/field.entity";

@Injectable()
export class FarmService {
  constructor(
    @InjectRepository(Farm) private farmRepository: Repository<Farm>,
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
  ) {}

  async createFarmOnly(createFarmOnlyDto: CreateFarmOnlyDto): Promise<Farm> {
    const { name } = createFarmOnlyDto;

    const newFarm = this.farmRepository.create({ name });

    return this.farmRepository.save(newFarm);
  }

  async createFarmWithCountry(createFarmDto: CreateFarmDto): Promise<Farm> {
    const { name, countryName } = createFarmDto;

    // Check if the country exists
    let country = await this.countryRepository.findOne({
      where: { name: countryName },
    });

    // If the country doesn't exist, create it
    if (!country) {
      country = await this.countryRepository.create({ name: countryName });
      await this.countryRepository.save(country);
    }

    // Create the farm and associate it with the country
    const farm = this.farmRepository.create({
      name,
      country,
    });

    await this.farmRepository.save(farm);

    // Return the created farm
    return farm;
  }

  // --- First function with Typeorm request ---
  // async findAll(): Promise<Farm[]> {
  //   try {
  //     const farms = await this.farmRepository
  //       .createQueryBuilder("farm")
  //       .leftJoinAndSelect("farm.country", "country")
  //       .andWhere("farm.deleted IS NULL")
  //       .getMany();

  //     if (!farms.length) {
  //       throw new NotFoundException("No farms found");
  //     }

  //     console.log("Fetched Farms:", farms);

  //     return farms;
  //   } catch (error) {
  //     console.error("Error fetching farms:", error);
  //     throw error;
  //   }
  // }

  // transformFarm and transformCountry -- use for findAllWithCountries and findById
  private transformFarm(farm: Farm) {
    return {
      id: farm.id,
      name: farm.name,
      created: farm.created,
      updated: farm.updated,
      deleted: farm.deleted,
      country: farm.country ? this.transformCountry(farm.country) : null,
      fields: [],
    };
  }

  private transformCountry(country: Country) {
    return {
      id: country.id,
      name: country.name,
      created: country.created,
      updated: country.updated,
      deleted: country.deleted,
    };
  }

  async findAllWithCountries() {
    const farms = await this.farmRepository.find({ relations: ["country"] });
    return farms.map((farm) => this.transformFarm(farm));
  }

  async findById(id: string) {
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

      return this.transformFarm(farm);
    } catch (error) {
      console.error("Error fetching farm by ID:", error);
      throw error;
    }
  }

  async updateFarm(id: string, updateFarmDto: UpdateFarmDto): Promise<Farm> {
    try {
      // Find the farm by ID
      const farm = await this.farmRepository.findOneOrFail({
        where: { id },
        relations: ["country"],
      });

      // If countryName is provided, update the farm's country
      if (updateFarmDto.countryName) {
        // Check if the new country exists
        let newCountry = await this.countryRepository.findOne({
          where: { name: updateFarmDto.countryName },
        });

        // If the new country doesn't exist, create it
        if (!newCountry) {
          newCountry = await this.countryRepository.create({
            name: updateFarmDto.countryName,
          });
          await this.countryRepository.save(newCountry);
        }

        // Update the farm's country
        farm.country = newCountry;
      }

      // Update farm
      if (updateFarmDto.name) {
        farm.name = updateFarmDto.name;
      }

      // Save the updated farm
      const updatedFarm = await this.farmRepository.save(farm);

      return updatedFarm;
    } catch (error) {
      console.error("Error updating farm:", error);

      if (error instanceof NotFoundException) {
        throw new NotFoundException(`Farm with ID ${id} not found`);
      }

      throw new Error("An error occurred while updating the farm");
    }
  }

  async deleteFarmOnlyById(
    id: string,
  ): Promise<{ id: string; name: string; message: string }> {
    try {
      // findOneOrFail expects an object with a "where" property
      const farm = await this.farmRepository.findOneOrFail({ where: { id } });

      const { name } = farm;
      // Soft delete by setting the "deleted" property
      farm.deleted = new Date();
      await this.farmRepository.save(farm);
      return {
        id,
        name,
        message: `Successfully deleted Farm with id ${id} and name ${name}`,
      };
    } catch (error) {
      throw new NotFoundException(`Farm with id ${id} not found`);
    }
  }

  //  The function must delete farm and related country - now Delete Farm only, not Country
  // Function not work

  // async deleteFarmAndCountryById(farmId: string): Promise<void> {
  //   try {
  //     // Find the farm and its associated country
  //     const farm = await this.farmRepository.findOneOrFail({
  //       where: { id: farmId },
  //       relations: ["country"],
  //     });

  //     if (!farm) {
  //       throw new NotFoundException(`Farm with id ${farmId} not found`);
  //     }

  //     const country = farm.country;

  //     // Soft delete the farm
  //     farm.deleted = new Date();
  //     await this.farmRepository.save(farm);

  //     // Soft delete the country
  //     if (country) {
  //       country.deleted = new Date();
  //       await this.countryRepository.save(country);
  //     }
  //   } catch (error) {
  //     throw new NotFoundException(`Farm or Country not found for the given ID`);
  //   }
  // }
}
