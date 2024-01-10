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
// import cookieSession from 'cookie-session';   // import cookieSession not work for nestjs
const cookieSession = require('cookie-session');

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
                    entities: [User, Report],
                    synchronize: true,
                };
            },
        }),
        // TypeOrmModule.forRoot({
        //     type: 'postgres',
        //     host: 'localhost',
        //     port: 5432,
        //     username: 'postgres',
        //     password: 'postgres',
        //     database: 'carPricingNestJS',
        //     entities: [User, Report],
        //     synchronize: true, // only for dev environment, not production
        // }),
        UsersModule,
        ReportsModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_PIPE,
            useValue: new ValidationPipe({
                whitelist: true,
            }),
        },
    ],
})
export class AppModule {
    constructor(private configService: ConfigService) {}

    configure(consumer: MiddlewareConsumer) {
        consumer.apply(cookieSession({ keys: [this.configService.get('COOKIE_KEY')] })).forRoutes('*');
    }
}
