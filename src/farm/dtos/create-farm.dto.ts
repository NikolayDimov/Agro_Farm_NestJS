// create-farm.dto.ts
import { IsNotEmpty, IsString } from "class-validator";

export class CreateFarmDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  countryName: string;

  // @IsUUID()
  // countryId: string;
}
