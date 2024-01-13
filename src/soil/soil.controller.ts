import {
  Controller,
  UseGuards,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  NotFoundException,
} from "@nestjs/common";
import { AuthGuard } from "../auth/auth.guard";
import { CreateSoilDto } from "./dtos/create-soil.dto";
import { SoilService } from "./soil.service";
import { UpdateSoilDto } from "./dtos/update-soil.dto";

@Controller("soil")
@UseGuards(AuthGuard)
export class SoilController {
  constructor(private soilService: SoilService) {}

  @Post("/createSoil")
  async createSoil(@Body() createSoilDto: CreateSoilDto) {
    try {
      return this.soilService.createSoil(createSoilDto);
    } catch (error) {
      console.error("Error creating soil:", error);
      throw new NotFoundException("Failed to create soil");
    }
  }

  @Get("getAll")
  async getAllSoils() {
    try {
      const soils = await this.soilService.findAll();
      return { data: soils };
    } catch (error) {
      console.error("Error fetching all soils:", error);
      throw new NotFoundException("Failed to fetch soils");
    }
  }

  @Get(":id")
  async getSoilById(@Param("id") id: string) {
    try {
      const soil = await this.soilService.findById(id);

      if (!soil) {
        throw new NotFoundException("Soil not found");
      }

      return { data: soil };
    } catch (error) {
      console.error("Error fetching soil by ID:", error);
      throw new NotFoundException("Soil not found");
    }
  }

  @Patch(":id")
  async updateSoil(
    @Param("id") id: string,
    @Body() updateSoilDto: UpdateSoilDto,
  ) {
    try {
      return this.soilService.updateSoil(id, updateSoilDto);
    } catch (error) {
      console.error("Error updating soil:", error);
      throw new NotFoundException("Failed to update soil");
    }
  }

  @Delete(":id")
  async deleteSoilById(
    @Param("id") id: string,
  ): Promise<{ id: string; name: string; message: string }> {
    try {
      return this.soilService.deleteSoilById(id);
    } catch (error) {
      console.error("Error deleting soil:", error);
      throw new NotFoundException("Failed to delete soil");
    }
  }
}
