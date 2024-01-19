import {
  Controller,
  UseGuards,
  Get,
  Post,
  Patch,
  Body,
  NotFoundException,
  Param,
  Delete,
  ParseUUIDPipe,
} from "@nestjs/common";
import { CreateFieldDto } from "./dtos/create-field.dto";
import { CreateFieldOnlyDto } from "./dtos/create-field-only.dto";
//import { UpdateFieldDto } from "./dtos/update-field.dto";
import { FieldService } from "./field.service";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorator/roles.decorator";
import { UserRole } from "../auth/dtos/role.enum";
import { CreateFieldWithSoilIdDto } from "./dtos/create-fieldWithSoilId.dto";
import { UpdateFieldSoilIdDto } from "./dtos/update-fieldSoilId.dto";

@Controller("field")
@UseGuards(RolesGuard)
export class FieldController {
  constructor(private fieldService: FieldService) {}

  // Cteare Field Only. No soil
  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Post("/createField")
  async createField(@Body() createFieldOnlyDto: CreateFieldOnlyDto) {
    try {
      return this.fieldService.createFieldOnly(createFieldOnlyDto);
    } catch (error) {
      console.error("Error creating field:", error);
      return { success: false, message: error.message };
    }
  }

  // Cteare Field and create new Soil. If there is no Soil - create new Soil. If there is a Soil - select from existing Soil
  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Post("createFieldWithSoil")
  async createFieldWithSoil(@Body() createFieldDto: CreateFieldDto) {
    try {
      const createdField =
        await this.fieldService.createFieldWithSoil(createFieldDto);
      return { data: createdField };
    } catch (error) {
      console.error("Error creating field eith soil:", error);
      return { success: false, message: error.message };
    }
  }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Post("createFieldWithSoilId")
  async createFieldWithSoilId(
    @Body() createFieldWithSoilIdDto: CreateFieldWithSoilIdDto,
  ) {
    try {
      const createdField = await this.fieldService.createFieldWithSoilId(
        createFieldWithSoilIdDto,
      );
      return { data: createdField };
    } catch (error) {
      console.error("Error creating field eith soil:", error);
      return { success: false, message: error.message };
    }
  }

  @Get("getAll")
  async getAllFields() {
    try {
      const transformedFields = await this.fieldService.findAllWithSoil();
      return { data: transformedFields };
    } catch (error) {
      console.error("Error fetching fields:", error);
      return { success: false, message: error.message };
    }
  }

  @Get(":id")
  async getFieldById(@Param("id", ParseUUIDPipe) id: string) {
    try {
      const transformedField = await this.fieldService.findById(id);
      return { data: transformedField };
    } catch (error) {
      console.error("Error fetching field:", error);
      return { success: false, message: error.message };
    }
  }

  // @Roles(UserRole.OWNER, UserRole.OPERATOR)
  // @Patch(":id")
  // async updateField(
  //   @Param("id") id: string,
  //   @Body() updateFieldDto: UpdateFieldDto,
  // ) {
  //   try {
  //     const updatedField = await this.fieldService.updateField(
  //       id,
  //       updateFieldDto,
  //     );
  //     return { data: updatedField };
  //   } catch (error) {
  //     console.error("Error updating field:", error);
  //     return { success: false, message: error.message };
  //   }
  // }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Patch(":id")
  async updateFieldSoilId(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateFieldSoilIdDto: UpdateFieldSoilIdDto,
  ) {
    try {
      const updatedFieldSoilId = await this.fieldService.updateFieldSoilId(
        id,
        updateFieldSoilIdDto,
      );
      return { data: updatedFieldSoilId };
    } catch (error) {
      console.error("Error updating field:", error);
      return { success: false, message: error.message };
    }
  }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Delete(":id")
  async deleteFieldById(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<{ id: string; name: string; message: string }> {
    try {
      return this.fieldService.deleteFieldById(id);
    } catch (error) {
      console.error("Error deleting field:", error);
      throw new NotFoundException("Failed to delete field");
    }
  }

  @Roles(UserRole.OWNER)
  @Delete(":id/permanent")
  async permanentlyDeleteFieldByIdForOwner(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<{ id: string; name: string; message: string }> {
    try {
      const userRole = UserRole.OWNER;

      return this.fieldService.permanentlyDeleteFieldByIdForOwner(id, userRole);
    } catch (error) {
      console.error("Error permanently deleting country:", error);
      throw new NotFoundException("Failed to permanently delete country");
    }
  }
}
