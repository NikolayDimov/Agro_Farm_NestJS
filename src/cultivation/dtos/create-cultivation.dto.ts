import { IsNotEmpty, IsUUID } from "class-validator";

export class CreateCultivationDto {
  @IsNotEmpty({ message: "Date cannot be empty" })
  date: Date;

  @IsNotEmpty()
  @IsUUID()
  growingPeriod: string;

  @IsNotEmpty()
  @IsUUID()
  cultivationType: string;

  @IsNotEmpty()
  @IsUUID()
  machine: string;
}
