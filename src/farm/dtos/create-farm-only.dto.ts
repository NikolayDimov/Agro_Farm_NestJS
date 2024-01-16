import { IsNotEmpty, IsString, Matches } from "class-validator";

export class CreateFarmOnlyDto {
  @IsNotEmpty({ message: "Name cannot be empty" })
  @IsString({ message: "Name must be a string" })
  @Matches(/^[A-Za-z0-9\s]+$/, {
    message: "Name must contain only letters and numbers",
  })
  name: string;

  // @IsLatLong({ message: "Name cannot be empty" })
  // location: string;
}
