import {
  Controller,
  ValidationPipe,
  Body,
  Post,
  NotFoundException,
  Delete,
  Param,
} from "@nestjs/common";
import { CreateGrowingPeriodDto } from "./dtos/create-growing-period.dto";
import { GrowingPeriodService } from "./growing-period.service";
import { GrowingPeriod } from "./growing-period.entity";

@Controller("growingPeriods")
export class GrowingPeriodController {
  constructor(private growingPeriodService: GrowingPeriodService) {}

  @Post("/createGrowingPeriod")
  async createGrowingPeriod(
    @Body(ValidationPipe) createGrowingPeriodDto: CreateGrowingPeriodDto,
  ): Promise<GrowingPeriod> {
    try {
      return this.growingPeriodService.createGrowingPeriod(
        createGrowingPeriodDto,
      );
    } catch (error) {
      console.error("Error creating country", error);
      throw new NotFoundException("Failed to delete country");
    }
  }
  @Delete(":id")
  async deleteFieldById(
    @Param("id") id: string,
  ): Promise<{ id: string; message: string }> {
    try {
      return this.growingPeriodService.deleteGrowingPeriodById(id);
    } catch (error) {
      console.error("Error deleting growing period:", error);
      throw new NotFoundException("Failed to delete growing period");
    }
  }
}
