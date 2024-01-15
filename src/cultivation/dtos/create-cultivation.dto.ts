import { IsNotEmpty } from "class-validator";
import { MachineDto } from "src/machine/dtos/machine.dto";

export class CreateCultivationDto {
  @IsNotEmpty({ message: "Date cannot be empty" })
  date: Date;

  // @IsNotEmpty()
  // @IsUUID()
  growingPeriod: string;

  @IsNotEmpty()
  cultivationType: string;

  @IsNotEmpty()
  machine: MachineDto;
}
