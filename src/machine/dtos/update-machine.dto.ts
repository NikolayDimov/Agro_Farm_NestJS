import { Expose } from "class-transformer";
import { IsString, IsNotEmpty, Matches, IsUUID } from "class-validator";

export class UpdateMachineDto {
  @Expose()
  @IsString()
  @IsNotEmpty({ message: "Name cannot be empty" })
  @IsString({ message: "Name must be a string" })
  @Matches(/^[A-Za-z0-9\s]+$/, {
    message: "Name must contain only letters and numbers",
  })
  brand: string;

  @Expose()
  @IsString()
  @IsNotEmpty({ message: "Name cannot be empty" })
  @IsString({ message: "Name must be a string" })
  @Matches(/^[A-Za-z0-9\s]+$/, {
    message: "Name must contain only letters and numbers",
  })
  model: string;

  @Expose()
  @IsString()
  @IsNotEmpty({ message: "Name cannot be empty" })
  @IsString({ message: "Name must be a string" })
  @Matches(/^[A-Za-z0-9\s]+$/, {
    message: "Name must contain only letters and numbers",
  })
  registerNumber: string;

  @IsUUID()
  farmId: string;
}
