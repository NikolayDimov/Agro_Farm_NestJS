import {
  Controller,
  UseGuards,
  Post,
  Patch,
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
import { UpdateFarmDto } from "./dtos/update-farm.dto";

@Controller("farm")
@UseGuards(AuthGuard)
export class FarmController {
  constructor(
    private farmService: FarmService,
    private countryService: CountryService,
  ) {}

  // Cteare Farm and must provide existing Country. If there is no Country - can't create Farm
  @Post("/createFarm")
  async createFarm(@Body() createFarmDto: CreateFarmDto) {
    return this.farmService.createFarmOnly(createFarmDto);
  }

  // Cteare Farm and create new Country. If there is no Country - create new Country. If there is a Country - select existing Country
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

  @Patch(":id")
  async updateFarm(
    @Param("id") id: string,
    @Body() updateFarmDto: UpdateFarmDto,
  ) {
    try {
      const updatedFarm = await this.farmService.updateFarm(id, updateFarmDto);
      return { data: updatedFarm };
    } catch (error) {
      console.error("Error updating farm:", error);

      if (error instanceof NotFoundException) {
        return { error: "Farm not found" };
      }

      return { error: "An error occurred while updating the farm" };
    }
  }

  @Delete(":id")
  async deleteFarmOnlyById(
    @Param("id") id: string,
  ): Promise<{ id: string; name: string; message: string }> {
    try {
      return this.farmService.deleteFarmOnlyById(id);
    } catch (error) {
      console.error("Error deleting farm:", error);
      throw new NotFoundException("Failed to delete farm");
    }
  }

  //  The function must delete farm and related country - now Delete Farm only, not Country
  // Function not work

  // @Delete(":id")
  // async deleteFarmAndCountryById(@Param("id") id: string): Promise<void> {
  //   await this.farmService.deleteFarmAndCountryById(id);
  // }
}
