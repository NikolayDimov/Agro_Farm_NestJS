import { IsNotEmpty, IsDateString, IsUUID, IsString } from "class-validator";
// import { MachineDto } from "src/machine/dtos/machine.dto";

export class CreateCultivationDto {
  @IsNotEmpty({ message: "Date cannot be empty" })
  @IsDateString()
  date: Date;

  @IsNotEmpty()
  @IsUUID()
  growingPeriod: string;

  @IsNotEmpty()
  @IsString()
  cultivationTypeName: string;

  @IsNotEmpty()
  @IsUUID()
  machineId: string;
}
