import { Module, ValidationPipe } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { APP_FILTER, APP_GUARD, APP_PIPE } from "@nestjs/core";
import { FarmModule } from "./farm/farm.module";
import { CountryModule } from "./country/country.module";
import { AuthModule } from "./auth/auth.module";
import { AuthGuard } from "./auth/guards/auth.guard";
import { FieldModule } from "./field/field.module";

import { dataSourceOptions } from "../db/data-source";
import { SoilModule } from "./soil/soil.module";
import { CultivationModule } from "./cultivation/cultivation.module";
import { CultivationTypeModule } from "./cultivation-type/cultivation-type.module";
import { GrowingPeriodModule } from "./growing-period/growing-period.module";
import { MachineModule } from "./machine/machine.module";
import { CropModule } from "./crop/crop.module";
import { ReportModule } from "./report/report.module";
import { HttpExceptionFilter } from "./filters/HttpExceptionFilter";

@Module({
  imports: [
    ConfigModule.forRoot(),

    TypeOrmModule.forRoot(dataSourceOptions),

    AuthModule,
    UsersModule,
    FarmModule,
    CountryModule,
    FieldModule,
    SoilModule,
    CultivationModule,
    CultivationTypeModule,
    GrowingPeriodModule,
    MachineModule,
    CropModule,
    ReportModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: AuthGuard },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
