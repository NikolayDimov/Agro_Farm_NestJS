import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class UpdateFarmDto {
  @IsOptional()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsUUID()
  countryId: string;
}
