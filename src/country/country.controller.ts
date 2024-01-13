import { Controller, Post, Body, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../auth/auth.guard";
import { CountryService } from "./country.service";
import { CreateCountryDto } from "./dtos/create-country.dto";

@Controller("country")
@UseGuards(AuthGuard)
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Post("/createCountry")
  async createCountry(@Body() createCountryDto: CreateCountryDto) {
    return this.countryService.createCountry(createCountryDto);
  }
}
