import { IsNotEmpty, IsString, Matches, IsUUID } from "class-validator";

export class UpdateCultivationDto {
  @IsNotEmpty({ message: "Name cannot be empty" })
  date: Date;

  @IsNotEmpty()
  @IsUUID()
  growingPeriod: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^[A-Za-z0-9\s]+$/, {
    message: "Cultivation Type name must contain only letters and numbers",
  })
  cultivationType: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^[A-Za-z0-9\s]+$/, {
    message: "Machine brand and model must contain only letters and numbers",
  })
  machine: string;
}
