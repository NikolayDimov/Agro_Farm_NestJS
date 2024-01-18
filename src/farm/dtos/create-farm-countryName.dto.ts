import { IsNotEmpty, IsString, Matches, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

class LocationDto {
  @IsNotEmpty({ message: "Coordinates cannot be empty" })
  @Type(() => Number)
  coordinates: [number, number];
}

export class CreateFarmCountryNameDto {
  @IsNotEmpty({ message: "Name cannot be empty" })
  @IsString({ message: "Name must be a string" })
  name: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^[A-Za-z0-9\s]+$/, {
    message: "Country Name must contain only letters and numbers",
  })
  countryName: string;

  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;
}
