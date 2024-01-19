import {
  Controller,
  UseGuards,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
} from "@nestjs/common";
import { CreateCultivationDto } from "./dtos/create-cultivation.dto";
import { UpdateCultivationDto } from "./dtos/update-cultivation.dto";
import { CultivationService } from "./cultivation.service";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorator/roles.decorator";
import { UserRole } from "../auth/dtos/role.enum";
import { CultivationType } from "../cultivation-type/cultivation-type.entity";
import { GrowingPeriod } from "../growing-period/growing-period.entity";
import { Machine } from "../machine/machine.entity";

@Controller("cultivation")
@UseGuards(RolesGuard)
export class CultivationController {
  constructor(private cultivationService: CultivationService) {}

  // Cteare Cultivation with growing_period, cultivation_type and machine. If there is no created Attributes - create new cultivation_type and machine. If there is a existing Attributes - select from existing cultivation_type and machine. Growing_period is UUID and always must be created
  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Post("createCultivation")
  async createCultivationWithAttributes(
    @Body() createCultivationDto: CreateCultivationDto,
  ) {
    const createdCultivation =
      await this.cultivationService.createCultivationWithAttributes(
        createCultivationDto,
      );
    return { data: createdCultivation };
  }

  @Get("getAll")
  async getAllFields() {
    const transformedCultivation =
      await this.cultivationService.findAllWithAttributes();
    return { data: transformedCultivation };
  }

  @Get(":id")
  async getCultivationById(@Param("id", ParseUUIDPipe) id: string) {
    const transformedField = await this.cultivationService.findById(id);
    return { data: transformedField };
  }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Patch(":id")
  async updateField(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateCultivationDto: UpdateCultivationDto,
  ) {
    const updatedCultivation = await this.cultivationService.updateCultivation(
      id,
      updateCultivationDto,
    );
    return { data: updatedCultivation };
  }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Delete(":id")
  async deleteFieldById(@Param("id", ParseUUIDPipe) id: string): Promise<{
    id: string;
    date: Date;
    growingPeriod: GrowingPeriod[];
    cultivationType: CultivationType[];
    machine: Machine[];
    message: string;
  }> {
    return this.cultivationService.deleteCultivationById(id);
  }
}
