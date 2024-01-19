import {
  Controller,
  UseGuards,
  Post,
  Patch,
  Body,
  Param,
  Get,
  Delete,
  ParseUUIDPipe,
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
    return this.farmService.createFarmOnly(createFarmOnlyDto);
  }

  //Cteare Farm and create new Country. If there is no Country - create new Country. If there is a Country - select from existing Country
  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Post("createFarmWithCountry")
  async createFarmWithCountry(@Body() createFarmDto: CreateFarmCountryNameDto) {
    const createdFarm =
      await this.farmService.createFarmWithCountry(createFarmDto);
    return { data: createdFarm };
  }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Post("createFarmWithCountryId")
  async createFarmWithCountryId(
    @Body() createFarmCountryIdDto: CreateFarmCountryIdDto,
  ) {
    console.log("Received request payload:", createFarmCountryIdDto);

    const createdFarm = await this.farmService.createFarmWithCountryId(
      createFarmCountryIdDto,
    );
    return { data: createdFarm };
  }

  @Get("getAll")
  async getAllFarms() {
    const transformedFarms = await this.farmService.findAllWithCountries();
    return { data: transformedFarms };
  }

  @Get(":id")
  async getFarmById(@Param("id", ParseUUIDPipe) id: string) {
    const transformedFarm = await this.farmService.findById(id);
    return { data: transformedFarm };
  }

  // Update Farm with CountryName
  // @Roles(UserRole.OWNER, UserRole.OPERATOR)
  // @Patch(":id")
  // async updateFarm(
  //   @Param("id") id: string,
  //   @Body() updateFarmCountryNameDto: UpdateFarmCountryNameDto,
  // ) {
  //     const updatedFarm = await this.farmService.updateFarmCountryName(
  //       id,
  //       updateFarmCountryNameDto,
  //     );
  //     return { data: updatedFarm };
  // }

  // Update Farm with CountryID
  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Patch(":id")
  async updateFarm(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateFarmCountryIdDto: UpdateFarmCountryIdDto,
  ) {
    const updatedFarm = await this.farmService.updateFarmCountryId(
      id,
      updateFarmCountryIdDto,
    );
    return { data: updatedFarm };
  }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Delete(":id")
  async deleteFarmOnlyById(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<{ id: string; name: string; message: string }> {
    return this.farmService.deleteFarmOnlyById(id);
  }

  @Roles(UserRole.OWNER)
  @Delete(":id/permanent")
  async permanentlyDeletefarmByIdForOwner(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<{ id: string; name: string; message: string }> {
    const userRole = UserRole.OWNER;

    return this.farmService.permanentlyDeletefarmByIdForOwner(id, userRole);
  }
}
