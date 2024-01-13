import {
  Controller,
  UseGuards,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
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
    return this.countryService.createCountry(createCountryDto);
  }

  @Get("getAllCountries")
  async getAllCountries() {
    return this.countryService.findAll();
  }

  @Get(":id")
  async getCountryById(@Param("id") id: string) {
    return this.countryService.findById(id);
  }

  @Patch(":id")
  async updateCountry(
    @Param("id") id: string,
    @Body() updateCountryDto: UpdateCountryDto,
  ) {
    return this.countryService.updateCountry(id, updateCountryDto);
  }

  @Delete(":id")
  async deleteCountryById(
    @Param("id") id: string,
  ): Promise<{ id: string; name: string; message: string }> {
    return this.countryService.deleteCountryById(id);
  }
}
