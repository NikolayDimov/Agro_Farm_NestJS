import {
  IsNotEmpty,
  IsString,
  Matches,
  IsObject,
  IsUUID,
} from "class-validator";
import { MultiPolygon } from "geojson";

export class UpdateFieldSoilIdDto {
  @IsNotEmpty({ message: "Name cannot be empty" })
  @IsString({ message: "Name must be a string" })
  @Matches(/^[A-Za-z0-9\s]+$/, {
    message: "Name must contain only letters and numbers",
  })
  name: string;

  @IsNotEmpty()
  @IsObject({ message: "Polygons must be a valid GeoJSON object" })
  boundary: MultiPolygon;

  @IsUUID()
  soilId: string;
}
