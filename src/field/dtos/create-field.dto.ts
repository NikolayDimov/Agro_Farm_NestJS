import { IsNotEmpty, IsString } from "class-validator";
import { MultiPolygon, Position } from "geojson";

export class CreateFieldDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  polygons: MultiPolygon | Position[][][];

  constructor(name: string, polygons: MultiPolygon | Position[][][]) {
    this.name = name;
    this.polygons = polygons;
  }
}
