import { Module } from '@nestjs/common';
import { GrowingPeriodController } from './growing-period.controller';
import { GrowingPeriodService } from './growing-period.service';

@Module({
  controllers: [GrowingPeriodController],
  providers: [GrowingPeriodService]
})
export class GrowingPeriodModule {}
