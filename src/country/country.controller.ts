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
} from "@nestjs/common";
import { AuthGuard } from "../auth/auth.guard";
import { CountryService } from "./country.service";
import { CreateCountryDto } from "./dtos/create-country.dto";
import { UpdateCountryDto } from "./dtos/update-country.dto";

@Controller("country")
@UseGuards(AuthGuard)
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Post("/createCountry")
  async createCountry(@Body() createCountryDto: CreateCountryDto) {
    try {
      return this.countryService.createCountry(createCountryDto);
    } catch (error) {
      console.error("Error creating country:", error);
      throw new NotFoundException("Failed to create country");
    }
  }

  @Get("getAllCountries")
  async getAllCountries() {
    try {
      return this.countryService.findAll();
    } catch (error) {
      console.error("Error fetching all countries:", error);
      throw new NotFoundException("Failed to fetch countries");
    }
  }

  @Get(":id")
  async getCountryById(@Param("id") id: string) {
    try {
      return this.countryService.findById(id);
    } catch (error) {
      console.error("Error fetching country by ID:", error);
      throw new NotFoundException("Country not found");
    }
  }

  @Patch(":id")
  async updateCountry(
    @Param("id") id: string,
    @Body() updateCountryDto: UpdateCountryDto,
  ) {
    try {
      return this.countryService.updateCountry(id, updateCountryDto);
    } catch (error) {
      console.error("Error updating country:", error);
      throw new NotFoundException("Failed to update country");
    }
  }

  @Delete(":id")
  async deleteCountryById(
    @Param("id") id: string,
  ): Promise<{ id: string; name: string; message: string }> {
    try {
      return this.countryService.deleteCountryById(id);
    } catch (error) {
      console.error("Error deleting country:", error);
      throw new NotFoundException("Failed to delete country");
    }
  }
}
