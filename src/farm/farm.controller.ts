import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Delete,
  NotFoundException,
} from "@nestjs/common";
import { CreateFarmDto } from "./dtos/create-farm.dto";
import { FarmService } from "./farm.service";
import { CountryService } from "../country/country.service";

@Controller("farm")
export class FarmController {
  constructor(
    private farmService: FarmService,
    private countryService: CountryService,
  ) {}

  @Post("/createFarm")
  async createFarm(@Body() createFarmDto: CreateFarmDto) {
    return this.farmService.createFarm(createFarmDto);
  }

  @Get("getAll")
  async getAllFarms(): Promise<{ data?; error?: string }> {
    try {
      const farms = await this.farmService.findAll();

      const transformedFarms = farms.map((farm) => ({
        id: farm.id,
        name: farm.name,
        created: farm.created,
        updated: farm.updated,
        deleted: farm.deleted,
        country: farm.country
          ? {
              id: farm.country.id,
              name: farm.country.name,
              created: farm.country.created,
              updated: farm.country.updated,
              deleted: farm.country.deleted,
            }
          : null,
        fields: [],
      }));

      return { data: transformedFarms };
    } catch (error) {
      console.error("Error fetching farms:", error);

      if (error instanceof NotFoundException) {
        return { error: "No farms found" };
      }

      return { error: "An error occurred while fetching farms" };
    }
  }

  @Get(":id")
  async getFarmById(@Param("id") id: string) {
    try {
      const farm = await this.farmService.findById(id);

      const transformedFarm = {
        id: farm.id,
        name: farm.name,
        created: farm.created,
        updated: farm.updated,
        deleted: farm.deleted,
        country: {
          id: farm.country.id,
          name: farm.country.name,
          created: farm.country.created,
          updated: farm.country.updated,
          deleted: farm.country.deleted,
        },
        fields: [],
      };

      return { data: transformedFarm };
    } catch (error) {
      console.error("Error fetching farm by ID:", error);
      throw new NotFoundException("Farm not found");
    }
  }

  @Delete(":id")
  async deleteFarmById(@Param("id") id: string): Promise<void> {
    await this.farmService.deleteFarmById(id);
  }
}
