import { Expose, Type } from "class-transformer";
import { GrowingPeriodDto } from "../../growing-period/dtos/growing-period.dto";
import { MachineDto } from "../../machine/dtos/machine.dto";
import { CultivationTypeDto } from "../../cultivation-type/dtos/cultivation-type.dto";

export class FieldDto {
  @Expose()
  id: string;

  @Expose()
  date: string;

  @Expose()
  @Type(() => GrowingPeriodDto)
  growingPeriod: GrowingPeriodDto;

  @Expose()
  @Type(() => CultivationTypeDto)
  cultivationTypeName: CultivationTypeDto;

  @Expose()
  @Type(() => MachineDto)
  machineId: MachineDto;
}
