import {
  Controller,
  UseGuards,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
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
    return this.countryService.createCountry(createCountryDto);
  }

  @Get("getAllCountries")
  async getAllCountries() {
    return this.countryService.findAll();
  }

  @Get(":id")
  async getCountryById(@Param("id", ParseUUIDPipe) id: string) {
    return this.countryService.findById(id);
  }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Patch(":id")
  async updateCountry(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateCountryDto: UpdateCountryDto,
  ) {
    return this.countryService.updateCountry(id, updateCountryDto);
  }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Delete(":id")
  async deleteCountryById(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<{ id: string; name: string; message: string }> {
    return this.countryService.deleteCountryById(id);
  }

  @Roles(UserRole.OWNER)
  @Delete(":id/permanent")
  async permanentlyDeleteCountryByIdForOwner(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<{ id: string; name: string; message: string }> {
    const userRole = UserRole.OWNER;

    return this.countryService.permanentlyDeleteCountryByIdForOwner(
      id,
      userRole,
    );
  }
}
