import {
  Controller,
  UseGuards,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
} from "@nestjs/common";
import { CreateFieldDto } from "./dtos/create-field.dto";
import { CreateFieldOnlyDto } from "./dtos/create-field-only.dto";
//import { UpdateFieldDto } from "./dtos/update-field.dto";
import { FieldService } from "./field.service";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorator/roles.decorator";
import { UserRole } from "../auth/dtos/role.enum";
import { CreateFieldWithSoilIdDto } from "./dtos/create-fieldWithSoilId.dto";
import { UpdateFieldSoilIdDto } from "./dtos/update-fieldSoilId.dto";

@Controller("field")
@UseGuards(RolesGuard)
export class FieldController {
  constructor(private fieldService: FieldService) {}

  // Cteare Field Only. No soil
  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Post("/createField")
  async createField(@Body() createFieldOnlyDto: CreateFieldOnlyDto) {
    return this.fieldService.createFieldOnly(createFieldOnlyDto);
  }

  // Cteare Field and create new Soil. If there is no Soil - create new Soil. If there is a Soil - select from existing Soil
  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Post("createFieldWithSoil")
  async createFieldWithSoil(@Body() createFieldDto: CreateFieldDto) {
    const createdField =
      await this.fieldService.createFieldWithSoil(createFieldDto);
    return { data: createdField };
  }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Post("createFieldWithSoilId")
  async createFieldWithSoilId(
    @Body() createFieldWithSoilIdDto: CreateFieldWithSoilIdDto,
  ) {
    const createdField = await this.fieldService.createFieldWithSoilId(
      createFieldWithSoilIdDto,
    );
    return { data: createdField };
  }

  @Get("getAll")
  async getAllFields() {
    const transformedFields = await this.fieldService.findAllWithSoil();
    return { data: transformedFields };
  }

  @Get(":id")
  async getFieldById(@Param("id", ParseUUIDPipe) id: string) {
    const transformedField = await this.fieldService.findById(id);
    return { data: transformedField };
  }

  // @Roles(UserRole.OWNER, UserRole.OPERATOR)
  // @Patch(":id")
  // async updateField(
  //   @Param("id") id: string,
  //   @Body() updateFieldDto: UpdateFieldDto,
  // ) {
  //     const updatedField = await this.fieldService.updateField(
  //       id,
  //       updateFieldDto,
  //     );
  //     return { data: updatedField };
  // }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Patch(":id")
  async updateFieldSoilId(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateFieldSoilIdDto: UpdateFieldSoilIdDto,
  ) {
    const updatedFieldSoilId = await this.fieldService.updateFieldSoilId(
      id,
      updateFieldSoilIdDto,
    );
    return { data: updatedFieldSoilId };
  }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Delete(":id")
  async deleteFieldById(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<{ id: string; name: string; message: string }> {
    return this.fieldService.deleteFieldById(id);
  }

  @Roles(UserRole.OWNER)
  @Delete(":id/permanent")
  async permanentlyDeleteFieldByIdForOwner(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<{ id: string; name: string; message: string }> {
    const userRole = UserRole.OWNER;

    return this.fieldService.permanentlyDeleteFieldByIdForOwner(id, userRole);
  }
}
