import { Controller, ValidationPipe, Body, Post } from "@nestjs/common";
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
    return this.growingPeriodService.createGrowingPeriod(
      createGrowingPeriodDto,
    );
  }
}
