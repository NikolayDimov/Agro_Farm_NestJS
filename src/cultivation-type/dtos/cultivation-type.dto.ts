import { Expose } from "class-transformer";

export class CultivationTypeDto {
  @Expose()
  id: string;

  @Expose()
  name: string;
}
