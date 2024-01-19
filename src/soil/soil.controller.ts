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
  ParseUUIDPipe,
} from "@nestjs/common";
import { CreateSoilDto } from "./dtos/create-soil.dto";
import { SoilService } from "./soil.service";
import { UpdateSoilDto } from "./dtos/update-soil.dto";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorator/roles.decorator";
import { UserRole } from "../auth/dtos/role.enum";

@Controller("soil")
@UseGuards(RolesGuard)
export class SoilController {
  constructor(private soilService: SoilService) {}

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Post("/createSoil")
  async createSoil(@Body() createSoilDto: CreateSoilDto) {
    try {
      return this.soilService.createSoil(createSoilDto);
    } catch (error) {
      console.error("Error creating soil:", error);
      return { success: false, message: error.message };
    }
  }

  @Get("getAll")
  async getAllSoils() {
    try {
      const soils = await this.soilService.findAll();
      return { data: soils };
    } catch (error) {
      console.error("Error fetching all soils:", error);
      return { success: false, message: error.message };
    }
  }

  @Get(":id")
  async getSoilById(@Param("id", ParseUUIDPipe) id: string) {
    try {
      const soil = await this.soilService.findById(id);
      if (!soil) {
        throw new NotFoundException("Soil not found");
      }
      return { data: soil };
    } catch (error) {
      console.error("Error fetching soil by ID:", error);
      return { success: false, message: error.message };
    }
  }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Patch(":id")
  async updateSoil(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateSoilDto: UpdateSoilDto,
  ) {
    try {
      return this.soilService.updateSoil(id, updateSoilDto);
    } catch (error) {
      console.error("Error updating soil:", error);
      return { success: false, message: error.message };
    }
  }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Delete(":id")
  async deleteSoilById(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<{ id: string; name: string; message: string }> {
    try {
      return this.soilService.deleteSoilById(id);
    } catch (error) {
      console.error("Error deleting soil:", error);
      throw new NotFoundException("Failed to delete soil");
    }
  }

  @Roles(UserRole.OWNER)
  @Delete(":id/permanent")
  async permanentlyDeleteCountryByIdForOwner(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<{ id: string; name: string; message: string }> {
    try {
      const userRole = UserRole.OWNER;

      return this.soilService.permanentlyDeleteSoilByIdForOwner(id, userRole);
    } catch (error) {
      console.error("Error permanently deleting country:", error);
      throw new NotFoundException("Failed to permanently delete country");
    }
  }
}

// When you use return with a promise inside an asynchronous function, the function automatically returns a promise that will be resolved with the value returned from the asynchronous operation. Here's the corrected explanation:
