import {
  Controller,
  UseGuards,
  // Get,
  Post,
  //Patch,
  Body,
  // NotFoundException,
  //Param,
  //Delete,
} from "@nestjs/common";
import { AuthGuard } from "../auth/auth.guard";
import { CreateCultivationDto } from "./dtos/create-cultivation.dto";
import { CreateCultivationOnlyDto } from "./dtos/create-cultivation-only.dto";
//import { UpdateCultivationDto } from "./dtos/update-cultivation.dto";
import { CultivationService } from "./cultivation.service";

@Controller("cultivation")
@UseGuards(AuthGuard)
export class CultivationController {
  constructor(private cultivationService: CultivationService) {}

  // Cteare Cultivation Only. No growing-period, cultivation-type, machine
  @Post("/createCultivation")
  async createCultivation(
    @Body() createCultivationOnlyDto: CreateCultivationOnlyDto,
  ) {
    try {
      return this.cultivationService.createCultivationOnly(
        createCultivationOnlyDto,
      );
    } catch (error) {
      console.error("Error creating cultivation with attributes:", error);
      return {
        message: "An error occurred while creating the cultivation.",
        statusCode: 500,
      };
    }
  }

  // Cteare Cultivation with growing_period, cultivation_type and machine. If there is no created Attributes - create new cultivation_type and machine. If there is a existing Attributes - select from existing cultivation_type and machine. Growing_period is UUID and always must be created
  @Post("createCultivationWithAttributes")
  async createCultivationWithAttributes(
    @Body() createCultivationDto: CreateCultivationDto,
  ) {
    try {
      const createdCultivation =
        await this.cultivationService.createCultivationWithAttributes(
          createCultivationDto,
        );
      return { data: createdCultivation };
    } catch (error) {
      console.error("Error creating cultivation with attributes:", error);
      return {
        message: "An error occurred while creating the cultivation.",
        statusCode: 500,
      };
    }
  }

  // @Get("getAll")
  // async getAllFields() {
  //   try {
  //     const transformedFields = await this.fieldService.findAllWithSoil();
  //     return { data: transformedFields };
  //   } catch (error) {
  //     console.error("Error fetching fields:", error);

  //     if (error instanceof NotFoundException) {
  //       return { error: "No fields found" };
  //     }

  //     return { error: "An error occurred while fetching fields" };
  //   }
  // }

  //   @Get(":id")
  //   async getFieldById(@Param("id") id: string) {
  //     try {
  //       const transformedField = await this.fieldService.findById(id);
  //       return { data: transformedField };
  //     } catch (error) {
  //       console.error("Error fetching field:", error);

  //       if (error instanceof NotFoundException) {
  //         return { error: "No field found" };
  //       }

  //       return { error: "An error occurred while fetching field" };
  //     }
  //   }

  //   @Patch(":id")
  //   async updateField(
  //     @Param("id") id: string,
  //     @Body() updateFieldDto: UpdateFieldDto,
  //   ) {
  //     try {
  //       const updatedField = await this.fieldService.updateField(
  //         id,
  //         updateFieldDto,
  //       );
  //       return { data: updatedField };
  //     } catch (error) {
  //       console.error("Error updating field:", error);

  //       if (error instanceof NotFoundException) {
  //         return { error: "Field not found" };
  //       }

  //       return { error: "An error occurred while updating the field" };
  //     }
  //   }

  //   @Delete(":id")
  //   async deleteFieldById(
  //     @Param("id") id: string,
  //   ): Promise<{ id: string; name: string; message: string }> {
  //     try {
  //       return this.fieldService.deleteFieldById(id);
  //     } catch (error) {
  //       console.error("Error deleting field:", error);
  //       throw new NotFoundException("Failed to delete field");
  //     }
  //   }
}
