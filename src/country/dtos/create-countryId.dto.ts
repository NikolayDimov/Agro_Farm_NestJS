import { IsNotEmpty, IsUUID } from "class-validator";

export class CreateCountryIdDto {
  @IsNotEmpty({ message: "Name cannot be empty" })
  @IsUUID()
  id: string;
}
