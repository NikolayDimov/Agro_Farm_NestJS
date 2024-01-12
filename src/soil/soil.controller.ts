import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  NotFoundException,
} from "@nestjs/common";
import { CreateSoilDto } from "./dtos/create-soil.dto";
import { SoilService } from "./soil.service";

@Controller("soil")
export class SoilController {
  constructor(private soilService: SoilService) {}

  @Post("/createSoil")
  async createFarm(@Body() createSoilDto: CreateSoilDto) {
    return this.soilService.createSoil(createSoilDto);
  }

  @Get("getAll")
  async getAllSoils() {
    const soils = await this.soilService.findAll();
    return { data: soils };
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

  @Delete(":id")
  async deleteSoilById(@Param("id") id: string): Promise<void> {
    await this.soilService.deleteSoilById(id);
  }
}
