import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';
import { APP_PIPE } from '@nestjs/core';
import { FarmModule } from './farm/farm.module';
import { CountryModule } from './country/country.module';
import { Farm } from './farm/farm.entity';
import { Country } from './country/country.entity';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/auth.guard';



@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: `.env.${process.env.NODE_ENV}`,
        }),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => {
                return {
                    type: 'postgres',
                    host: 'localhost',
                    port: 5432,
                    username: config.get<string>('USERNAME'),
                    password: config.get<string>('PASSWORD'),
                    database: config.get<string>('DB_NAME'),
                    entities: [User, Report, Farm, Country],
                    synchronize: true,
                };
            },
        }),
  
        UsersModule,
        ReportsModule,
        FarmModule,
        CountryModule,
        AuthModule,
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
export class AppModule {
   

}
