import { Injectable } from "@nestjs/common";
import { FarmService } from "../farm/farm.service";
import { CultivationService } from "../cultivation/cultivation.service";
import { FieldService } from "../field/field.service";
import { GrowingPeriodService } from "../growing-period/growing-period.service";

@Injectable()
export class ReportService {
  constructor(
    private readonly farmService: FarmService,
    private readonly cultivationService: CultivationService,
    private readonly fieldService: FieldService,
    private readonly growingPeriodService: GrowingPeriodService,
  ) {}

  async getFarmsWithMostMachines() {
    return this.farmService.getFarmsWithMostMachines();
  }

  async generateFieldsPerFarmAndCropReport(): Promise<
    { farmName: string; cropName: string; fieldCount: number }[]
  > {
    const fieldsPerFarmAndCrop =
      await this.farmService.getFieldsPerFarmAndCrop();
    return fieldsPerFarmAndCrop;
  }

  async getMostCommonSoilTypePerFarm() {
    const result =
      await this.cultivationService.getMostCommonFielddSoilTypePerFarm();

    return result.map((report) => ({
      farmName: report.farmName,
      mostCommonSoilType: report.mostCommonSoilType,
      soilName: report.soilName,
      occurrences: report.occurrences,
    }));
  }

  async generateCultivationReport(): Promise<any[]> {
    try {
      return await this.cultivationService.generateCultivationReport();
    } catch (error) {
      console.error("Error generating cultivation report:", error);
      throw new Error("Failed to generate cultivation report");
    }
  }
}
