import { Controller, Get, UseGuards } from "@nestjs/common";
import { ReportService } from "./report.service";
import { AuthGuard } from "src/auth/guards/auth.guard";

@Controller("report")
@UseGuards(AuthGuard)
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get("/farmsWithMostMachines")
  async getFarmsWithMostMachines() {
    try {
      return await this.reportService.getFarmsWithMostMachines();
    } catch (error) {
      console.error("Error fetching all machines:", error);
      return { success: false, message: error.message };
    }
  }

  @Get("/fieldCountPerFarmCrop")
  async generateFieldsPerFarmAndCropReport() {
    try {
      return await this.reportService.generateFieldsPerFarmAndCropReport();
    } catch (error) {
      console.error("Error fetching all machines:", error);
      return { success: false, message: error.message };
    }
  }

  @Get("/mostCommonSoilTypePerFarm")
  async getMostCommonSoilTypePerFarm() {
    try {
      return await this.reportService.getMostCommonSoilTypePerFarm();
    } catch (error) {
      console.error("Error fetching all machines:", error);
      return { success: false, message: error.message };
    }
  }
}
