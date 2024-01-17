import {
  Controller,
  ValidationPipe,
  Body,
  Post,
  NotFoundException,
} from "@nestjs/common";
import { CreateGrowingPeriodDto } from "./dtos/create-growing-period.dto";
import { GrowingPeriodService } from "./growing-period.service";
import { GrowingPeriod } from "./growing-period.entity";

@Controller("growing-periods")
export class GrowingPeriodController {
  constructor(private growingPeriodService: GrowingPeriodService) {}

  @Post("/createGP")
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
}
