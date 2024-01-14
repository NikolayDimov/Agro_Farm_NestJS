import {
  Controller,
  UseGuards,
  Post,
  Body,
  Param,
  Get,
  Delete,
  NotFoundException,
} from "@nestjs/common";
import { AuthGuard } from "../auth/auth.guard";
import { CreateFarmDto } from "./dtos/create-farm.dto";
import { FarmService } from "./farm.service";
import { CountryService } from "../country/country.service";

@Controller("farm")
@UseGuards(AuthGuard)
export class FarmController {
  constructor(
    private farmService: FarmService,
    private countryService: CountryService,
  ) {}

  @Post("/createFarm")
  async createFarm(@Body() createFarmDto: CreateFarmDto) {
    return this.farmService.createFarmOnly(createFarmDto);
  }

  @Post("createFarmWithCountry")
  async createFarmWithCountry(@Body() createFarmDto: CreateFarmDto) {
    const createdFarm =
      await this.farmService.createFarmWithCountry(createFarmDto);
    return { data: createdFarm };
  }

  @Get("getAll")
  async getAllFarms() {
    try {
      const transformedFarms = await this.farmService.findAllWithCountries();
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
      const transformedFarm = await this.farmService.findById(id);
      return { data: transformedFarm };
    } catch (error) {
      console.error("Error fetching farms:", error);

      if (error instanceof NotFoundException) {
        return { error: "No farms found" };
      }

      return { error: "An error occurred while fetching farms" };
    }
  }

  @Delete(":id")
  async deleteFarmById(@Param("id") id: string): Promise<void> {
    await this.farmService.deleteFarmOnlyById(id);
  }

  @Delete(":id")
  async deleteFarmAndCountryById(@Param("id") id: string): Promise<void> {
    await this.farmService.deleteFarmAndCountryById(id);
  }
}
