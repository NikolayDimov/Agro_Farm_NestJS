import { IsNotEmpty, IsString, Matches } from "class-validator";

export class CreateFarmDto {
  @IsNotEmpty({ message: "Name cannot be empty" })
  @IsString({ message: "Name must be a string" })
  @Matches(/^[A-Za-z0-9\s]+$/, {
    message: "Name must contain only letters and numbers",
  })
  name: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^[A-Za-z0-9\s]+$/, {
    message: "Country Name must contain only letters and numbers",
  })
  countryName: string;

  // @IsUUID()
  // countryId: string;
}
