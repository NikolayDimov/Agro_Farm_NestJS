import { IsNotEmpty, IsDateString, IsUUID } from "class-validator";

export class CreateCultivationDto {
  @IsNotEmpty({ message: "Date cannot be empty" })
  @IsDateString()
  date: Date;

  @IsNotEmpty()
  @IsUUID()
  growingPeriodId: string;

  @IsNotEmpty()
  @IsUUID()
  cultivationTypeId: string;

  @IsNotEmpty()
  @IsUUID()
  machineId: string;
}
