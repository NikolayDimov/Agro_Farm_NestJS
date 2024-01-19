import {
  Controller,
  ValidationPipe,
  Body,
  Post,
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
    return this.growingPeriodService.createGrowingPeriod(
      createGrowingPeriodDto,
    );
  }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Delete(":id")
  async deleteFieldById(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<{ id: string; message: string }> {
    return this.growingPeriodService.deleteGrowingPeriodById(id);
  }
}
