import { Expose } from "class-transformer";
import { IsString, IsOptional } from "class-validator";

export class UpdateCountryDto {
  @Expose()
  @IsOptional()
  @IsString()
  name?: string;
}
