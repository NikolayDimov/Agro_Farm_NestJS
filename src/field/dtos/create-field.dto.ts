import { IsNotEmpty, IsString, Matches, IsObject } from "class-validator";
import { MultiPolygon } from "geojson";

export class CreateFieldDto {
  @IsNotEmpty({ message: "Name cannot be empty" })
  @IsString({ message: "Name must be a string" })
  @Matches(/^[A-Za-z0-9\s]+$/, {
    message: "Name must contain only letters and numbers",
  })
  name: string;

  @IsNotEmpty({ message: "Polygons cannot be empty" })
  @IsObject({ message: "Polygons must be a valid GeoJSON object" })
  boundary: MultiPolygon;

  @IsNotEmpty()
  @IsString()
  @Matches(/^[A-Za-z0-9\s]+$/, {
    message: "Soil Name must contain only letters and numbers",
  })
  soilName: string;

  @IsNotEmpty()
  @IsString()
  farmId: string;
}
