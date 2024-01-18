import { IsNotEmpty, IsString, Matches, ValidateNested } from "class-validator";
// import { IsCoordinate } from "./coordinate.validator";
import { Type } from "class-transformer";

class LocationDto {
  @IsNotEmpty({ message: "Coordinates cannot be empty" })
  @Type(() => Number)
  coordinates: [number, number];
}

export class CreateFarmOnlyDto {
  @IsNotEmpty({ message: "Name cannot be empty" })
  @IsString({ message: "Name must be a string" })
  @Matches(/^[A-Za-z0-9\s]+$/, {
    message: "Name must contain only letters and numbers",
  })
  name: string;

  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;
}
