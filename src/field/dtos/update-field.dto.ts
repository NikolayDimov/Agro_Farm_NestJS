import { IsNotEmpty, IsString, Matches } from "class-validator";
import { MultiPolygon, Position } from "geojson";

export class UpdateFieldDto {
  @IsNotEmpty({ message: "Name cannot be empty" })
  @IsString({ message: "Name must be a string" })
  @Matches(/^[A-Za-z0-9\s]+$/, {
    message: "Name must contain only letters and numbers",
  })
  name: string;

  @IsNotEmpty()
  @IsString()
  polygons: MultiPolygon | Position[][][];

  @IsNotEmpty()
  @IsString()
  @Matches(/^[A-Za-z0-9\s]+$/, {
    message: "Soil Name must contain only letters and numbers",
  })
  soilName: string;
}
