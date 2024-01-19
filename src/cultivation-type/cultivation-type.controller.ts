import {
  Body,
  Controller,
  Post,
  Delete,
  Param,
  UseGuards,
  NotFoundException,
  ParseUUIDPipe,
  //Patch,
} from "@nestjs/common";
import { Roles } from "../auth/decorator/roles.decorator";
import { UserRole } from "../auth/dtos/role.enum";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { CultivationTypeService } from "./cultivation-type.service";
import { CreateCultivationTypeDto } from "./dtos/create-cultivation-type.dto";
//import { UpdateCultivationTypeDto } from "./dtos/update-cultivation-type.dto";

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

  // @Roles(UserRole.OWNER, UserRole.OPERATOR)
  // @Patch(":id")
  // async updateCultivationType(
  //   @Param("id") id: string,
  //   @Body() updateCultivationTypeDto: UpdateCultivationTypeDto,
  // ) {
  //   try {
  //     return this.cultivationTypeService.updateCultivationType(
  //       id,
  //       updateCultivationTypeDto,
  //     );
  //   } catch (error) {
  //     console.error("Error updating cultivation type:", error);
  //     return { success: false, message: error.message };
  //   }
  // }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Delete(":id")
  async deleteMachineById(@Param("id", ParseUUIDPipe) id: string): Promise<{
    id: string;
    name: string;
    message: string;
  }> {
    try {
      return this.cultivationTypeService.deleteCultivationTypeById(id);
    } catch (error) {
      console.error("Error deleting cultivation type:", error);
      throw new NotFoundException("Failed to delete cultivation type");
    }
  }
}
