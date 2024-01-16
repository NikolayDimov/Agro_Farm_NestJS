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
import { AuthGuard } from "../auth/guards/auth.guard";
import { CreateFarmDto } from "./dtos/create-farm.dto";
import { CreateFarmOnlyDto } from "./dtos/create-farm-only.dto";
import { UpdateFarmDto } from "./dtos/update-farm.dto";
import { FarmService } from "./farm.service";

@Controller("farm")
@UseGuards(AuthGuard)
export class FarmController {
  constructor(private farmService: FarmService) {}

  // Cteare Farm and must provide existing Country. If there is no Country - can't create Farm
  @Post("/createFarm")
  async createFarm(@Body() createFarmOnlyDto: CreateFarmOnlyDto) {
    try {
      return this.farmService.createFarmOnly(createFarmOnlyDto);
    } catch (error) {
      console.error("Error creating farm:", error);
      return {
        message: "An error occurred while creating the farm.",
        statusCode: 500,
      };
    }
  }

  // Cteare Farm and create new Country. If there is no Country - create new Country. If there is a Country - select from existing Country
  @Post("createFarmWithCountry")
  async createFarmWithCountry(@Body() createFarmDto: CreateFarmDto) {
    try {
      const createdFarm =
        await this.farmService.createFarmWithCountry(createFarmDto);
      return { data: createdFarm };
    } catch (error) {
      console.error("Error creating farm with country:", error);
      return {
        message: "An error occurred while creating the farm.",
        statusCode: 500,
      };
    }
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
      console.error("Error fetching farm:", error);

      if (error instanceof NotFoundException) {
        return { error: "No farm found" };
      }

      return { error: "An error occurred while fetching farm" };
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
