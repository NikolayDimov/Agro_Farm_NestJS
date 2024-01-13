import {
  Controller,
  UseGuards,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  NotFoundException,
} from "@nestjs/common";
import { AuthGuard } from "../auth/auth.guard";
import { CropService } from "./crop.service";
import { CreateCropDto } from "./dtos/create-crop.dto";
import { UpdateCropDto } from "./dtos/update-crop.dto";

@Controller("crop")
@UseGuards(AuthGuard)
export class CropController {
  constructor(private readonly cropService: CropService) {}

  @Post("/createCrop")
  async createCrop(@Body() createCropDto: CreateCropDto) {
    try {
      return this.cropService.createCrop(createCropDto);
    } catch (error) {
      console.error("Error creating crop:", error);
      throw new NotFoundException("Failed to create crop");
    }
  }

  @Get("getAll")
  async getAllCrops() {
    try {
      return this.cropService.findAll();
    } catch (error) {
      console.error("Error fetching all crops:", error);
      throw new NotFoundException("Failed to fetch crops");
    }
  }

  @Get(":id")
  async getCropById(@Param("id") id: string) {
    try {
      return this.cropService.findById(id);
    } catch (error) {
      console.error("Error fetching crop by ID:", error);
      throw new NotFoundException("Crop not found");
    }
  }

  @Patch(":id")
  async updateCrop(
    @Param("id") id: string,
    @Body() updateCropDto: UpdateCropDto,
  ) {
    try {
      return this.cropService.updateCrop(id, updateCropDto);
    } catch (error) {
      console.error("Error updating crop:", error);
      throw new NotFoundException("Failed to update crop");
    }
  }

  @Delete(":id")
  async deleteCropById(
    @Param("id") id: string,
  ): Promise<{ id: string; name: string; message: string }> {
    try {
      return this.cropService.deleteCropById(id);
    } catch (error) {
      console.error("Error deleting crop:", error);
      throw new NotFoundException("Failed to delete crop");
    }
  }
}
