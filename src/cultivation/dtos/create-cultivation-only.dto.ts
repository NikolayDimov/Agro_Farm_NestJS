import { IsNotEmpty } from "class-validator";

export class CreateCultivationOnlyDto {
  @IsNotEmpty({ message: "Date cannot be empty" })
  date: Date;
}
