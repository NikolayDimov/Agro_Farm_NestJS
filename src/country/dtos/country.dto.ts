import { Expose } from "class-transformer";

export class CountryDto {
  @Expose()
  id: string;

  @Expose()
  name: string;
}
