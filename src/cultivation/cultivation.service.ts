import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Cultivation } from "./cultivation.entity";
import { CreateCultivationDto } from "./dtos/create-cultivation.dto";
import { UpdateCultivationDto } from "./dtos/update-cultivation.dto";
import { GrowingPeriodService } from "../growing-period/growing-period.service";
import { CultivationTypeService } from "../cultivation-type/cultivation-type.service";
import { MachineService } from "../machine/machine.service";
import { CultivationType } from "../cultivation-type/cultivation-type.entity";
import { GrowingPeriod } from "../growing-period/growing-period.entity";
import { Machine } from "../machine/machine.entity";

@Injectable()
export class CultivationService {
  constructor(
    @InjectRepository(Cultivation)
    private cultivationRepository: Repository<Cultivation>,
    private growingPeriodService: GrowingPeriodService,
    private cultivationTypeService: CultivationTypeService,
    private machineService: MachineService,
  ) {}

  async createCultivationWithAttributes(
    createCultivationDto: CreateCultivationDto,
  ): Promise<Cultivation> {
    const { date, cultivationTypeId, machineId, growingPeriodId } =
      createCultivationDto;

    const growingPeriod = await this.growingPeriodService.findOne(
      growingPeriodId,
      { relations: ["field", "field.farm"] },
    );
    if (!growingPeriod) {
      throw new BadRequestException(
        `There is no growing period with id ${growingPeriodId}`,
      );
    }

    const cultivationType =
      await this.cultivationTypeService.findOne(cultivationTypeId);
    if (!cultivationTypeId) {
      throw new BadRequestException(
        `There is no cultivation type with id ${cultivationTypeId}`,
      );
    }

    const machine = await this.machineService.findOne(machineId, {
      relations: ["farm"],
    });
    if (!machine) {
      throw new BadRequestException(
        `There is no machine type with id ${machineId}`,
      );
    }
    // console.log(machine);
    // console.log(growingPeriod);
    // console.log(cultivationType);

    if (machine.farm.id !== growingPeriod.field.farm.id) {
      throw new BadRequestException(
        `There is no machine with id ${machineId} in current farm`,
      );
    }

    // Create the cultivation and associate it with the growing_period, cultivation_type, and machine
    const cultivation = this.cultivationRepository.create({
      date,
      growingPeriod,
      cultivationType,
      machine,
    });

    const createdCultivation =
      await this.cultivationRepository.save(cultivation);

    // Return the created cultivation
    return createdCultivation;
  }

  async findOne(
    id: string,
    options?: { relations?: string[] },
  ): Promise<Cultivation> {
    if (!id) {
      return null;
    }

    return await this.cultivationRepository.findOne({
      where: { id },
      relations: options?.relations,
    });
  }

  // transformField and transformSoil -- use for findAllWithSoil and findById
  private transformCultivation(cultivationObj: Cultivation) {
    return {
      id: cultivationObj.id,
      date: cultivationObj.date,
      created: cultivationObj.created,
      updated: cultivationObj.updated,
      deleted: cultivationObj.deleted,
      growingPeriod: cultivationObj.growingPeriod,
      machine: cultivationObj.machine,
      cultivationType: cultivationObj.cultivationType,
    };
  }

  async findAllWithAttributes() {
    const cultivations = await this.cultivationRepository
      .createQueryBuilder("cultivation")
      .leftJoinAndSelect("cultivation.growingPeriod", "growingPeriod")
      .leftJoinAndSelect("cultivation.machine", "machine")
      .leftJoinAndSelect("cultivation.cultivationType", "cultivationType")
      .where("cultivation.deleted IS NULL")
      .getMany();

    return cultivations.map((cultivation) =>
      this.transformCultivation(cultivation),
    );
  }

  async findById(id: string): Promise<Cultivation> {
    const cultivation = await this.cultivationRepository
      .createQueryBuilder("cultivation")
      .leftJoinAndSelect("cultivation.growingPeriod", "growingPeriod")
      .leftJoinAndSelect("cultivation.machine", "machine")
      .leftJoinAndSelect("cultivation.cultivationType", "cultivationType")
      .andWhere("cultivation.id = :id", { id })
      .andWhere("cultivation.deleted IS NULL")
      .getOne();

    if (!cultivation) {
      throw new NotFoundException(`Cultivation with ID ${id} not found`);
    }

    return this.transformCultivation(cultivation);
  }

  async updateCultivation(
    id: string,
    updateCultivationDto: UpdateCultivationDto,
  ): Promise<Cultivation> {
    const existingCultivation = await this.cultivationRepository.findOne({
      where: { id },
      relations: [
        "growingPeriod",
        "growingPeriod.field",
        "growingPeriod.crop",
        "cultivationType",
        "machine",
      ],
    });

    if (updateCultivationDto.date) {
      existingCultivation.date = updateCultivationDto.date;
    }

    if (updateCultivationDto.growingPeriodId) {
      const growingPeriodId = await this.growingPeriodService.findOne(
        updateCultivationDto.growingPeriodId,
      );

      if (!growingPeriodId) {
        throw new BadRequestException("No growingPeriodId found");
      }

      existingCultivation.growingPeriod = growingPeriodId;
    }

    if (updateCultivationDto.cultivationTypeId) {
      const cultivationTypeId = await this.cultivationTypeService.findOne(
        updateCultivationDto.cultivationTypeId,
      );

      if (!cultivationTypeId) {
        throw new BadRequestException("No cultivationTypeId found");
      }

      existingCultivation.cultivationType = cultivationTypeId;
    }

    if (updateCultivationDto.machineId) {
      const machineId = await this.machineService.findOne(
        updateCultivationDto.machineId,
      );

      if (!machineId) {
        throw new BadRequestException("No machineId found");
      }

      existingCultivation.machine = machineId;
    }

    return await this.cultivationRepository.save(existingCultivation);
  }

  async deleteCultivationById(id: string): Promise<{
    id: string;
    date: Date;
    growingPeriod: GrowingPeriod[];
    cultivationType: CultivationType[];
    machine: Machine[];
    message: string;
  }> {
    const existingCultivation = await this.cultivationRepository.findOne({
      where: { id },
      relations: ["growingPeriod", "cultivationType", "machine"],
    });

    if (!existingCultivation) {
      throw new NotFoundException(`Cultivation with id ${id} not found`);
    }

    const growingPeriod: GrowingPeriod[] = (existingCultivation.growingPeriod ??
      []) as GrowingPeriod[];
    const cultivationType: CultivationType[] =
      (existingCultivation.cultivationType ?? []) as CultivationType[];
    const machine: Machine[] = (existingCultivation.machine ?? []) as Machine[];

    if (
      growingPeriod.length > 0 ||
      cultivationType.length > 0 ||
      machine.length > 0
    ) {
      throw new BadRequestException(
        "This Cultivation has associated growingPeriod, cultivationType, or machine. Cannot be soft deleted.",
      );
    }

    // Soft delete using the softDelete method
    await this.cultivationRepository.softDelete({ id });

    return {
      id,
      date: existingCultivation.deleted || new Date(), // Use deleted instead of date
      growingPeriod,
      cultivationType,
      machine,
      message: `Successfully soft deleted cultivation with id ${id}`,
    };
  }

  // Most common field soil type (texture) per farm
  async getMostCommonFielddSoilTypePerFarm(): Promise<
    {
      farmName: string;
      mostCommonSoilType: string;
      soilName: string;
      occurrences: number;
    }[]
  > {
    const result = await this.cultivationRepository
      .createQueryBuilder("cultivation")
      .select("farm.name", "farmName")
      .addSelect("field.soil", "mostCommonSoilType")
      .addSelect("soil.name", "soilName")
      .addSelect("COUNT(cultivation.id)", "occurrences")
      .leftJoin("cultivation.growingPeriod", "growingPeriod")
      .leftJoin("growingPeriod.field", "field")
      .leftJoin("field.farm", "farm")
      .leftJoin("field.soil", "soil")
      .groupBy("farm.name, field.soil, soil.name")
      .orderBy("occurrences", "DESC")
      .getRawMany();

    return result;
  }

  async generateCultivationReport(): Promise<CultivationReportDTO[]> {
    const result: CultivationReportDTO[] = await this.cultivationRepository
      .createQueryBuilder("cultivation")
      .select([
        "cultivation.date AS cultivationDate",
        "cultivationType.name AS cultivationTypeName",
        "field.name AS fieldName",
        "machine.brand AS machineBrand",
        "machine.model AS machineModel",
        "crop.name AS cropName",
        "soil.name AS soilName",
        "farm.name AS farmName",
      ])
      .leftJoin("cultivation.growingPeriod", "growingPeriod")
      .leftJoin("cultivation.cultivationType", "cultivationType")
      .leftJoin("growingPeriod.field", "field")
      .leftJoin("field.soil", "soil")
      .leftJoin("field.farm", "farm")
      .leftJoin("cultivation.machine", "machine")
      .leftJoin("growingPeriod.crop", "crop")
      .where("cultivation.deleted_at IS NULL")
      .orderBy("cultivation.date", "ASC")
      .getRawMany();

    return result;
  }
}
