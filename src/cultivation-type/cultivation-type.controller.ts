import {
  Body,
  Controller,
  Post,
  Delete,
  Param,
  UseGuards,
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
    return this.cultivationTypeService.createCultivationType(
      createCultivationTypeDto,
    );
  }

  // @Roles(UserRole.OWNER, UserRole.OPERATOR)
  // @Patch(":id")
  // async updateCultivationType(
  //   @Param("id") id: string,
  //   @Body() updateCultivationTypeDto: UpdateCultivationTypeDto,
  // ) {
  //     return this.cultivationTypeService.updateCultivationType(
  //       id,
  //       updateCultivationTypeDto,
  //     );
  // }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Delete(":id")
  async deleteMachineById(@Param("id", ParseUUIDPipe) id: string): Promise<{
    id: string;
    name: string;
    message: string;
  }> {
    return this.cultivationTypeService.deleteCultivationTypeById(id);
  }
}
