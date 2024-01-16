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
} from "@nestjs/common";
import { AuthGuard } from "../auth/guards/auth.guard";
import { CreateFieldDto } from "./dtos/create-field.dto";
import { CreateFieldOnlyDto } from "./dtos/create-field-only.dto";
import { UpdateFieldDto } from "./dtos/update-field.dto";
import { FieldService } from "./field.service";

@Controller("field")
@UseGuards(AuthGuard)
export class FieldController {
  constructor(private fieldService: FieldService) {}

  // Cteare Field Only. No soil
  @Post("/createField")
  async createField(@Body() createFieldOnlyDto: CreateFieldOnlyDto) {
    try {
      return this.fieldService.createFieldOnly(createFieldOnlyDto);
    } catch (error) {
      console.error("Error creating field:", error);
      return {
        message: "An error occurred while creating the field.",
        statusCode: 500,
      };
    }
  }

  // Cteare Field and create new Soil. If there is no Soil - create new Soil. If there is a Soil - select from existing Soil
  @Post("createFieldWithSoil")
  async createFieldWithSoil(@Body() createFieldDto: CreateFieldDto) {
    try {
      const createdField =
        await this.fieldService.createFieldWithSoil(createFieldDto);
      return { data: createdField };
    } catch (error) {
      console.error("Error creating field eith soil:", error);
      return {
        message: "An error occurred while creating the field.",
        statusCode: 500,
      };
    }
  }

  @Get("getAll")
  async getAllFields() {
    try {
      const transformedFields = await this.fieldService.findAllWithSoil();
      return { data: transformedFields };
    } catch (error) {
      console.error("Error fetching fields:", error);

      if (error instanceof NotFoundException) {
        return { error: "No fields found" };
      }

      return { error: "An error occurred while fetching fields" };
    }
  }

  @Get(":id")
  async getFieldById(@Param("id") id: string) {
    try {
      const transformedField = await this.fieldService.findById(id);
      return { data: transformedField };
    } catch (error) {
      console.error("Error fetching field:", error);

      if (error instanceof NotFoundException) {
        return { error: "No field found" };
      }

      return { error: "An error occurred while fetching field" };
    }
  }

  @Patch(":id")
  async updateField(
    @Param("id") id: string,
    @Body() updateFieldDto: UpdateFieldDto,
  ) {
    try {
      const updatedField = await this.fieldService.updateField(
        id,
        updateFieldDto,
      );
      return { data: updatedField };
    } catch (error) {
      console.error("Error updating field:", error);

      if (error instanceof NotFoundException) {
        return { error: "Field not found" };
      }

      return { error: "An error occurred while updating the field" };
    }
  }

  @Delete(":id")
  async deleteFieldById(
    @Param("id") id: string,
  ): Promise<{ id: string; name: string; message: string }> {
    try {
      return this.fieldService.deleteFieldById(id);
    } catch (error) {
      console.error("Error deleting field:", error);
      throw new NotFoundException("Failed to delete field");
    }
  }
}
