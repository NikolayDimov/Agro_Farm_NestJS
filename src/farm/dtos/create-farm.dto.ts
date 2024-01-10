import { IsString, IsNumber, Min, Max, IsLongitude, IsLatitude } from "class-validator";


export class CreateFarmDto {
    @IsString()
    name: string;

}