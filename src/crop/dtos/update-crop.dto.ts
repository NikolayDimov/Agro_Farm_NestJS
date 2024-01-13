import { Expose } from "class-transformer";
import { IsString, IsOptional } from "class-validator";

export class UpdateCropDto {
  @Expose()
  @IsOptional()
  @IsString()
  name?: string;
}
