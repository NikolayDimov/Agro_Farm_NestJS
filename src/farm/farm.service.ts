import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Farm } from "./farm.entity";
import { CreateFarmCountryNameDto } from "./dtos/create-farm-countryName.dto";
import { CreateFarmOnlyDto } from "./dtos/create-farm-only.dto";
import { UpdateFarmCountryNameDto } from "./dtos/update-farm-countryName.dto";
import { Country } from "../country/country.entity";
import { UserRole } from "../auth/dtos/role.enum";
import { CountryService } from "../country/country.service";
import { CreateFarmCountryIdDto } from "./dtos/create-farm-countryId.dto";
import { UpdateFarmCountryIdDto } from "./dtos/update-farm-countryId.dto";

@Injectable()
export class FarmService {
  constructor(
    @InjectRepository(Farm) private farmRepository: Repository<Farm>,
    private countryService: CountryService,
  ) {}

  async createFarmOnly(createFarmOnlyDto: CreateFarmOnlyDto): Promise<Farm> {
    const { name, location } = createFarmOnlyDto;
    if (
      !location ||
      !location.coordinates ||
      location.coordinates.length !== 2 ||
      !location.coordinates.every((coord) => typeof coord === "number")
    ) {
      throw new Error("Invalid coordinates provided");
    }

    // Create a GeoJSON Point object for the location
    const locationObject = {
      type: "Point",
      coordinates: location.coordinates,
    };

    // Serialize the GeoJSON Point to a JSON string
    const locationString = JSON.stringify(locationObject);

    const newFarm = this.farmRepository.create({
      name,
      location: locationString, // Set the location property
    });

    return this.farmRepository.save(newFarm);
  }

  async createFarmWithCountry(
    CreateFarmCountryNameDto: CreateFarmCountryNameDto,
  ): Promise<Farm> {
    const { name, countryName, location } = CreateFarmCountryNameDto;
    if (
      !location ||
      !location.coordinates ||
      location.coordinates.length !== 2 ||
      !location.coordinates.every((coord) => typeof coord === "number")
    ) {
      throw new Error("Invalid coordinates provided");
    }

    let country = await this.countryService.findOneByName(countryName);
    if (!country) {
      country = await this.countryService.createCountry({ name: countryName });
    }

    const farm = new Farm();
    farm.name = name;
    farm.country = country;

    // Create a GeoJSON Point object for the location
    const locationObject = {
      type: "Point",
      coordinates: location.coordinates,
    };

    // Serialize the GeoJSON Point to a JSON string
    farm.location = JSON.stringify(locationObject);

    const createdFarm = await this.farmRepository.save(farm);

    return createdFarm;
  }

  async createFarmWithCountryId(
    createFarmDto: CreateFarmCountryIdDto,
  ): Promise<Farm> {
    const { name, countryId, location } = createFarmDto;

    if (
      !location ||
      !location.coordinates ||
      location.coordinates.length !== 2 ||
      !location.coordinates.every((coord) => typeof coord === "number")
    ) {
      throw new Error("Invalid coordinates provided");
    }

    // Assuming you have a method to fetch the country entity by ID
    const country = await this.countryService.findOne(countryId);

    if (!country) {
      throw new Error("Country not found");
    }

    const farm = new Farm();
    farm.name = name;
    farm.country = country;

    // Create a GeoJSON Point object for the location
    const locationObject = {
      type: "Point",
      coordinates: location.coordinates,
    };

    // Serialize the GeoJSON Point to a JSON string
    farm.location = JSON.stringify(locationObject);

    const createdFarm = await this.farmRepository.save(farm);

    return createdFarm;
  }

  async findOne(id: string, options?: { relations?: string[] }): Promise<Farm> {
    if (!id) {
      return null;
    }

    return await this.farmRepository.findOne({
      where: { id },
      relations: options?.relations,
    });
  }

  async findOneById(id: string): Promise<Farm> {
    const farm = await this.farmRepository.findOne({ where: { id } });
    return farm;
  }

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

  // async findAllWithCountries() {
  //   const fields = await this.farmRepository
  //     .createQueryBuilder("farm")
  //     .leftJoinAndSelect("farm.country", "country")
  //     .leftJoinAndSelect("country.farm", "farm")
  //     .where("farm.deleted IS NULL")
  //     .getMany();

  //   return fields.map((farm) => this.transformFarm(farm));
  // }

  async findById(id: string) {
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
  }

  async updateFarmCountryName(
    id: string,
    updateFarmCountryNameDto: UpdateFarmCountryNameDto,
  ): Promise<Farm> {
    // Find the farm by ID
    const farm = await this.farmRepository.findOne({
      where: { id },
      relations: ["country"],
    });
    // If countryName is provided, update the farm's country
    if (updateFarmCountryNameDto.countryName) {
      // Check if the new country exists
      let newCountry = await this.countryService.findOneByName(
        updateFarmCountryNameDto.countryName,
      );
      // If the new country doesn't exist, create it
      if (!newCountry) {
        newCountry = await this.countryService.createCountry({
          name: updateFarmCountryNameDto.countryName,
        });
      }
      // Update the farm's country
      farm.country = newCountry;
    }
    // Update farm
    if (updateFarmCountryNameDto.name) {
      farm.name = updateFarmCountryNameDto.name;
    }
    // Save the updated farm
    const updatedFarm = await this.farmRepository.save(farm);
    return updatedFarm;
  }

  async updateFarmCountryId(
    id: string,
    updateFarmCountryIdDto: UpdateFarmCountryIdDto,
  ): Promise<Farm> {
    // console.log("Received ID:", id);
    const existingfarm = await this.farmRepository.findOne({
      where: { id },
      relations: ["country"],
    });

    if (updateFarmCountryIdDto.countryId) {
      const newCountry = await this.countryService.findOne(
        updateFarmCountryIdDto.countryId,
      );

      existingfarm.country = newCountry;
    }

    if (updateFarmCountryIdDto.name) {
      existingfarm.name = updateFarmCountryIdDto.name;
    }

    const updatedFarmCountryIdDto =
      await this.farmRepository.save(existingfarm);

    // console.log("Updated Field:", updatedField);
    return updatedFarmCountryIdDto;
  }

  async deleteFarmOnlyById(
    id: string,
  ): Promise<{ id: string; name: string; message: string }> {
    const existingFarm = await this.farmRepository.findOneBy({ id });

    if (!existingFarm) {
      throw new NotFoundException(`Farm with id ${id} not found`);
    }

    // Soft delete using the softDelete method
    await this.farmRepository.softDelete({ id });

    return {
      id,
      name: existingFarm.name,
      message: `Successfully soft-deleted Farm with id ${id} and name ${existingFarm.name}`,
    };
  }

  async permanentlyDeletefarmByIdForOwner(
    id: string,
    userRole: UserRole,
  ): Promise<{ id: string; name: string; message: string }> {
    const existingFarm = await this.farmRepository.findOneBy({ id });

    if (!existingFarm) {
      throw new NotFoundException(`Farm with id ${id} not found`);
    }

    // Check if the user has the necessary role (OWNER) to perform the permanent delete
    if (userRole !== UserRole.OWNER) {
      throw new NotFoundException("User does not have the required role");
    }

    // Perform the permanent delete
    await this.farmRepository.remove(existingFarm);

    return {
      id,
      name: existingFarm.name,
      message: `Successfully permanently deleted Farm with id ${id} and name ${existingFarm.name}`,
    };
  }

  // Farm with mmost machines
  async getFarmsWithMostMachines(): Promise<
    { farmId: string; farmName: string; machineCount: number }[]
  > {
    const result = await this.farmRepository
      .createQueryBuilder("farm")
      .leftJoinAndSelect("farm.machines", "machines")
      .select([
        "farm.id as farmId",
        "farm.name as farmName",
        "COUNT(DISTINCT machines.id) as machineCount",
      ])
      .groupBy("farm.id, farm.name")
      .orderBy("machineCount", "DESC")
      .limit(10)
      .getRawMany();

    return result;
  }

  // Count of fields per farm and crop
  async getFieldsPerFarmAndCrop(): Promise<
    { farmName: string; cropName: string; fieldCount: number }[]
  > {
    const fieldsPerFarmAndCrop = await this.farmRepository
      .createQueryBuilder("farm")
      .leftJoin("farm.fields", "field")
      .leftJoin("field.growingPeriods", "growingPeriod")
      .leftJoin("growingPeriod.crop", "crop")
      .select([
        "farm.name AS farmName",
        "crop.name AS cropName",
        "COUNT(DISTINCT field.id) AS fieldCount",
      ])
      .groupBy("farm.name, crop.name")
      .getRawMany();

    return fieldsPerFarmAndCrop;
  }
}
