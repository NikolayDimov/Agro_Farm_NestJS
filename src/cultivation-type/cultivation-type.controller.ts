import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { Roles } from "../auth/decorator/roles.decorator";
import { UserRole } from "../auth/dtos/role.enum";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { CultivationTypeService } from "./cultivation-type.service";
import { CreateCultivationTypeDto } from "./dtos/create-cultivation-type.dto";

@Controller("cultivationType")
@UseGuards(RolesGuard)
export class CultivationTypeController {
  constructor(private cultivationTypeService: CultivationTypeService) {}

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Post("/createCultivationType")
  async createCultivation(
    @Body() createCultivationTypeDto: CreateCultivationTypeDto,
  ) {
    try {
      return this.cultivationTypeService.createCultivationType(
        createCultivationTypeDto,
      );
    } catch (error) {
      console.error("Error creating cultivation type", error);
      const errorMessage = error?.response?.message || "An error occurred";
      return { error: errorMessage };
    }
  }
}
