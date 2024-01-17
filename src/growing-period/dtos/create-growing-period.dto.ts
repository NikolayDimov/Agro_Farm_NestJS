import { IsNotEmpty, IsUUID } from "class-validator";

export class CreateGrowingPeriodDto {
  @IsNotEmpty()
  @IsUUID()
  fieldId: string;

  @IsNotEmpty()
  @IsUUID()
  cropId: string;
}
