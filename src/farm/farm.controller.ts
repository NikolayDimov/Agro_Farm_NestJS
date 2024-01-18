import {
  Controller,
  UseGuards,
  Post,
  Patch,
  Body,
  Param,
  Get,
  Delete,
  NotFoundException,
} from "@nestjs/common";
import { CreateFarmCountryNameDto } from "./dtos/create-farm-countryName.dto";
import { CreateFarmOnlyDto } from "./dtos/create-farm-only.dto";
//import { UpdateFarmCountryNameDto } from "./dtos/update-farm-countryName.dto";
import { FarmService } from "./farm.service";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorator/roles.decorator";
import { UserRole } from "../auth/dtos/role.enum";
import { CreateFarmCountryIdDto } from "./dtos/create-farm-countryId.dto";
import { UpdateFarmCountryIdDto } from "./dtos/update-farm-countryId.dto";

@Controller("farm")
@UseGuards(RolesGuard)
export class FarmController {
  constructor(private farmService: FarmService) {}

  // Cteare Farm and must provide existing Country. If there is no Country - can't create Farm
  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Post("/createFarm")
  async createFarm(@Body() createFarmOnlyDto: CreateFarmOnlyDto) {
    try {
      return this.farmService.createFarmOnly(createFarmOnlyDto);
    } catch (error) {
      console.error("Error creating farm with country:", error);
      return { success: false, message: error.message };
    }
  }

  //Cteare Farm and create new Country. If there is no Country - create new Country. If there is a Country - select from existing Country
  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Post("createFarmWithCountry")
  async createFarmWithCountry(@Body() createFarmDto: CreateFarmCountryNameDto) {
    try {
      const createdFarm =
        await this.farmService.createFarmWithCountry(createFarmDto);
      return { data: createdFarm };
    } catch (error) {
      console.error("Error creating farm with country:", error);
      return { success: false, message: error.message };
    }
  }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Post("createFarmWithCountryId")
  async createFarmWithCountryId(
    @Body() createFarmCountryIdDto: CreateFarmCountryIdDto,
  ) {
    console.log("Received request payload:", createFarmCountryIdDto);
    try {
      const createdFarm = await this.farmService.createFarmWithCountryId(
        createFarmCountryIdDto,
      );
      return { data: createdFarm };
    } catch (error) {
      console.error("Error creating farm with country:", error);
      return { success: false, message: error.message };
    }
  }

  @Get("getAll")
  async getAllFarms() {
    try {
      const transformedFarms = await this.farmService.findAllWithCountries();
      return { data: transformedFarms };
    } catch (error) {
      console.error("Error fetching farms:", error);
      if (error instanceof NotFoundException) {
        return { error: "No farms found" };
      }
      return { success: false, message: error.message };
    }
  }

  @Get(":id")
  async getFarmById(@Param("id") id: string) {
    try {
      const transformedFarm = await this.farmService.findById(id);
      return { data: transformedFarm };
    } catch (error) {
      console.error("Error fetching farm:", error);
      if (error instanceof NotFoundException) {
        return { error: "No farm found" };
      }
      return { success: false, message: error.message };
    }
  }

  // Update Farm with CountryName
  // @Roles(UserRole.OWNER, UserRole.OPERATOR)
  // @Patch(":id")
  // async updateFarm(
  //   @Param("id") id: string,
  //   @Body() updateFarmCountryNameDto: UpdateFarmCountryNameDto,
  // ) {
  //   try {
  //     const updatedFarm = await this.farmService.updateFarmCountryName(
  //       id,
  //       updateFarmCountryNameDto,
  //     );
  //     return { data: updatedFarm };
  //   } catch (error) {
  //     console.error("Error updating farm:", error);
  //     if (error instanceof NotFoundException) {
  //       return { error: "Farm not found" };
  //     }
  //     return { success: false, message: error.message };
  //   }
  // }

  // Update Farm with CountryID
  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Patch(":id")
  async updateFarm(
    @Param("id") id: string,
    @Body() updateFarmCountryIdDto: UpdateFarmCountryIdDto,
  ) {
    try {
      const updatedFarm = await this.farmService.updateFarmCountryId(
        id,
        updateFarmCountryIdDto,
      );
      return { data: updatedFarm };
    } catch (error) {
      console.error("Error updating farm:", error);
      if (error instanceof NotFoundException) {
        return { error: "Farm not found" };
      }
      return { success: false, message: error.message };
    }
  }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Delete(":id")
  async deleteFarmOnlyById(
    @Param("id") id: string,
  ): Promise<{ id: string; name: string; message: string }> {
    try {
      return this.farmService.deleteFarmOnlyById(id);
    } catch (error) {
      console.error("Error deleting farm:", error);
      throw new NotFoundException("Failed to delete farm");
    }
  }

  @Roles(UserRole.OWNER)
  @Delete(":id/permanent")
  async permanentlyDeletefarmByIdForOwner(
    @Param("id") id: string,
  ): Promise<{ id: string; name: string; message: string }> {
    try {
      const userRole = UserRole.OWNER;

      return this.farmService.permanentlyDeletefarmByIdForOwner(id, userRole);
    } catch (error) {
      console.error("Error permanently deleting farm:", error);
      throw new NotFoundException("Failed to permanently delete farm");
    }
  }
}
