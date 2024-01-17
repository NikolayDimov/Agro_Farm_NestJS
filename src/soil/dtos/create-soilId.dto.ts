import { IsNotEmpty, IsUUID } from "class-validator";

export class CreateSoilIdDto {
  @IsNotEmpty({ message: "Name cannot be empty" })
  @IsUUID()
  id: string;
}
