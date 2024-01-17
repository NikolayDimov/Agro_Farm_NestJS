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
import { CropService } from "./crop.service";
import { CreateCropDto } from "./dtos/create-crop.dto";
import { UpdateCropDto } from "./dtos/update-crop.dto";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { Roles } from "../auth/decorator/roles.decorator";
import { UserRole } from "../auth/dtos/role.enum";

@Controller("crop")
@UseGuards(RolesGuard)
export class CropController {
  constructor(private readonly cropService: CropService) {}

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Post("/createCrop")
  async createCrop(@Body() createCropDto: CreateCropDto) {
    try {
      return this.cropService.createCrop(createCropDto);
    } catch (error) {
      console.error("Error creating crop:", error);
      return { success: false, message: error.message };
    }
  }

  @Get("getAll")
  async getAllCrops() {
    try {
      return this.cropService.findAll();
    } catch (error) {
      console.error("Error fetching all crops:", error);
      return { success: false, message: error.message };
    }
  }

  @Get(":id")
  async getCropById(@Param("id") id: string) {
    try {
      return this.cropService.findById(id);
    } catch (error) {
      console.error("Error fetching crop by ID:", error);
      return { success: false, message: error.message };
    }
  }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Patch(":id")
  async updateCrop(
    @Param("id") id: string,
    @Body() updateCropDto: UpdateCropDto,
  ) {
    try {
      return this.cropService.updateCrop(id, updateCropDto);
    } catch (error) {
      console.error("Error updating crop:", error);
      return { success: false, message: error.message };
    }
  }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
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

  @Roles(UserRole.OWNER)
  @Delete(":id/permanent")
  async permanentlyDeleteCropByIdForOwner(
    @Param("id") id: string,
  ): Promise<{ id: string; name: string; message: string }> {
    try {
      const userRole = UserRole.OWNER;

      return this.cropService.permanentlyDeleteCropByIdForOwner(id, userRole);
    } catch (error) {
      console.error("Error permanently deleting crop:", error);
      throw new NotFoundException("Failed to permanently delete crop");
    }
  }
}
