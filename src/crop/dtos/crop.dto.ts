import { Expose } from "class-transformer";

export class CropDto {
  @Expose()
  id: string;

  @Expose()
  name: string;
}
