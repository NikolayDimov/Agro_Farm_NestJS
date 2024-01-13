import {
  Controller,
  UseGuards,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
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
  async createCountry(@Body() createCropDto: CreateCropDto) {
    return this.cropService.createCrop(createCropDto);
  }

  @Get("getAllCrops")
  async getAllCrops() {
    return this.cropService.findAll();
  }

  @Get(":id")
  async getCropById(@Param("id") id: string) {
    return this.cropService.findById(id);
  }

  @Patch(":id")
  async updateCrop(
    @Param("id") id: string,
    @Body() updateCropDto: UpdateCropDto,
  ) {
    return this.cropService.updateCrop(id, updateCropDto);
  }

  @Delete(":id")
  async deleteCropById(@Param("id") id: string): Promise<void> {
    return this.cropService.deleteCropById(id);
  }
}
