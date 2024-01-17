import { IsNotEmpty, IsString, IsUUID, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

class LocationDto {
  @IsNotEmpty({ message: "Coordinates cannot be empty" })
  @Type(() => Number)
  coordinates: [number, number];
}

export class CreateFarmCountryIdDto {
  @IsNotEmpty({ message: "Name cannot be empty" })
  @IsString({ message: "Name must be a string" })
  name: string;

  @IsUUID(undefined, { message: "Invalid country ID" })
  countryId: string;

  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;
}
