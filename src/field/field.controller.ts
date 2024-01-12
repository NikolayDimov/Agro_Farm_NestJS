import {
  Controller,
  Get,
  Post,
  Body,
  NotFoundException,
  Param,
  Delete,
} from "@nestjs/common";
import { FieldService } from "./field.service";
import { CreateFieldDto } from "./dtos/create-field.dto";

@Controller("field")
export class FieldController {
  constructor(private fieldService: FieldService) {}

  @Post("/createField")
  async createField(@Body() createFieldDto: CreateFieldDto) {
    return this.fieldService.createField(createFieldDto);
  }

  @Get("getAll")
  async getAllFields(): Promise<{ data?; error?: string }> {
    try {
      const fields = await this.fieldService.findAll();

      // Transform the data before returning
      const transformedFields = fields.map((field) => ({
        id: field.id,
        name: field.name,
        created: field.created,
        updated: field.updated,
        deleted: field.deleted,
        polygons: field.polygons,
      }));

      return { data: transformedFields };
    } catch (error) {
      console.error("Error fetching fields:", error);

      if (error instanceof NotFoundException) {
        return { error: "No fields found" };
      }

      return { error: "An error occurred while fetching fields" };
    }
  }

  @Get("getAllFieldsDetails")
  async getAllFieldsWithDetails() {
    try {
      const fields = await this.fieldService.getAllFieldsWithDetails();
      return { data: fields };
    } catch (error) {
      console.error("Error fetching fields with details:", error);
      return { error: "An error occurred while fetching fields with details" };
    }
  }

  @Get(":id")
  async getFieldById(@Param("id") id: string) {
    try {
      const field = await this.fieldService.findById(id);
      return { data: field };
    } catch (error) {
      console.error("Error fetching field by ID:", error);

      if (error instanceof NotFoundException) {
        return { error: "Field not found" };
      }

      return { error: "An error occurred while fetching field by ID" };
    }
  }
  @Delete(":id")
  async deleteFieldById(@Param("id") id: string): Promise<void> {
    await this.fieldService.deleteFieldById(id);
  }
}
