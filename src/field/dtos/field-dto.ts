import { Expose, Type } from "class-transformer";
import { FarmDto } from "src/farm/dtos/farm.dto";
import { SoilDto } from "src/soil/dtos/soil.dto";

export class FieldDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  polygons: string;

  @Expose()
  @Type(() => FarmDto)
  farm: FarmDto;

  @Expose()
  @Type(() => SoilDto)
  soil: SoilDto;
}
