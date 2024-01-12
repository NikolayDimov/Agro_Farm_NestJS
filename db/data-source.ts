// dataSourceOptions.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

const dataSourceOptions: TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'process.env.USERNAME',
    password: 'process.env.PASSWORD', //process.env.PASSWORD || 'your_default_password'
    database: 'Aprocess.env.DB',
    entities: ['dist/**/*.entity.js'],
    migrations: ['dist/db/migrations/*.js'],
} as TypeOrmModuleOptions;

console.log(process.env.USERNAME, process.env.PASSWORD, process.env.DB_NAME);

export default dataSourceOptions;
