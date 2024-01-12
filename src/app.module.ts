import { Module, ValidationPipe } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { APP_PIPE } from "@nestjs/core";
import { FarmModule } from "./farm/farm.module";
import { CountryModule } from "./country/country.module";
import { AuthModule } from "./auth/auth.module";
import { AuthGuard } from "./auth/auth.guard";
import { FieldModule } from "./field/field.module";

import { dataSourceOptions } from "../db/data-source";
import { SoilModule } from "./soil/soil.module";
import { CultivationModule } from "./cultivation/cultivation.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    //     isGlobal: true,
    //     envFilePath: `.env.${process.env.NODE_ENV}`,
    // }),
    TypeOrmModule.forRoot(dataSourceOptions),
    // TypeOrmModule.forRootAsync({
    //     useFactory: (config: ConfigService) => {
    //         return {
    //             type: 'postgres',
    //             host: 'localhost',
    //     inject: [ConfigService],
    //             port: 5432,
    //             username: config.get<string>('USERNAME'),
    //             password: config.get<string>('PASSWORD'),
    //             database: config.get<string>('DB_NAME'),
    //             entities: [User, Farm, Country, Field],
    //             synchronize: true,
    //         };
    // ConfigModule.forRoot({
    //     },
    // }),

    UsersModule,
    FarmModule,
    CountryModule,
    AuthModule,
    FieldModule,
    SoilModule,
    CultivationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AuthGuard,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
})
export class AppModule {}
