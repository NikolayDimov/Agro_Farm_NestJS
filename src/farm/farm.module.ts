import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { FarmController } from './farm.controller';
import { FarmService } from './farm.service';
import { Farm } from './farm.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Farm])],
  controllers: [FarmController],
  providers: [FarmService]
})
export class FarmModule {}
