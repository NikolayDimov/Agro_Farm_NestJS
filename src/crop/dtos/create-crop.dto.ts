import { IsString } from "class-validator";

export class CreateCropDto {
  @IsString()
  name: string;
}
