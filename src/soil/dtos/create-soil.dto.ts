import { IsNotEmpty, IsString } from "class-validator";

export class CreateSoilDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
