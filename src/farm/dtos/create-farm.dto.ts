import { IsString, IsNumber, Min, Max, IsLongitude, IsLatitude } from "class-validator";


export class CreateReportDto {
    @IsString()
    name: string;

}