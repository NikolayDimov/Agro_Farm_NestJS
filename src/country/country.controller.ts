import {
  Controller,
  UseGuards,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  NotFoundException,
  ParseUUIDPipe,
} from "@nestjs/common";
import { CountryService } from "./country.service";
import { CreateCountryDto } from "./dtos/create-country.dto";
import { UpdateCountryDto } from "./dtos/update-country.dto";
import { Roles } from "../auth/decorator/roles.decorator";
import { UserRole } from "../auth/dtos/role.enum";
import { RolesGuard } from "../auth/guards/roles.guard";

@Controller("country")
@UseGuards(RolesGuard)
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Post("/createCountry")
  async createCountry(@Body() createCountryDto: CreateCountryDto) {
    try {
      return this.countryService.createCountry(createCountryDto);
    } catch (error) {
      console.error("Error creating country", error);
      return { success: false, message: error.message };
    }
  }

  @Get("getAllCountries")
  async getAllCountries() {
    try {
      return this.countryService.findAll();
    } catch (error) {
      console.error("Error fetching all countries:", error);
      if (error instanceof NotFoundException) {
        return { error: "Farm not found" };
      }
      return { success: false, message: error.message };
    }
  }

  @Get(":id")
  async getCountryById(@Param("id", ParseUUIDPipe) id: string) {
    try {
      return this.countryService.findById(id);
    } catch (error) {
      console.error("Error fetching country by ID:", error);
      if (error instanceof NotFoundException) {
        return { error: "Farm not found" };
      }
      return { success: false, message: error.message };
    }
  }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Patch(":id")
  async updateCountry(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateCountryDto: UpdateCountryDto,
  ) {
    try {
      return this.countryService.updateCountry(id, updateCountryDto);
    } catch (error) {
      console.error("Error updating country:", error);
      if (error instanceof NotFoundException) {
        return { error: "Farm not found" };
      }
      return { success: false, message: error.message };
    }
  }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Delete(":id")
  async deleteCountryById(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<{ id: string; name: string; message: string }> {
    try {
      return this.countryService.deleteCountryById(id);
    } catch (error) {
      console.error("Error deleting country:", error);
      throw new NotFoundException("Failed to delete country");
    }
  }

  @Roles(UserRole.OWNER)
  @Delete(":id/permanent")
  async permanentlyDeleteCountryByIdForOwner(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<{ id: string; name: string; message: string }> {
    try {
      const userRole = UserRole.OWNER;

      return this.countryService.permanentlyDeleteCountryByIdForOwner(
        id,
        userRole,
      );
    } catch (error) {
      console.error("Error permanently deleting country:", error);
      throw new NotFoundException("Failed to permanently delete country");
    }
  }
}
