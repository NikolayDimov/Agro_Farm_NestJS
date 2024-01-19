import {
  Controller,
  ValidationPipe,
  Body,
  Post,
  NotFoundException,
  Delete,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from "@nestjs/common";
import { CreateGrowingPeriodDto } from "./dtos/create-growing-period.dto";
import { GrowingPeriodService } from "./growing-period.service";
import { GrowingPeriod } from "./growing-period.entity";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorator/roles.decorator";
import { UserRole } from "../auth/dtos/role.enum";

@Controller("growingPeriods")
@UseGuards(RolesGuard)
export class GrowingPeriodController {
  constructor(private growingPeriodService: GrowingPeriodService) {}

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
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

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Delete(":id")
  async deleteFieldById(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<{ id: string; message: string }> {
    try {
      return this.growingPeriodService.deleteGrowingPeriodById(id);
    } catch (error) {
      console.error("Error deleting growing period:", error);
      throw new NotFoundException("Failed to delete growing period");
    }
  }
}
