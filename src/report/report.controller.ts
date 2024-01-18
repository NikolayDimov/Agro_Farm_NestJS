import { Controller, Get } from "@nestjs/common";
import { ReportService } from "./report.service";

@Controller("report")
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get("/farmsWithMostMachines")
  async getFarmsWithMostMachines() {
    return this.reportService.getFarmsWithMostMachines();
  }

  @Get("/fieldCountPerFarmCrop")
  async generateFieldsPerFarmAndCropReport() {
    return this.reportService.generateFieldsPerFarmAndCropReport();
  }

  @Get("/mostCommonSoilTypePerFarm")
  async getMostCommonSoilTypePerFarm() {
    return this.reportService.getMostCommonSoilTypePerFarm();
  }
}
