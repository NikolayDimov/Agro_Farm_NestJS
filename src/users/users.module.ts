import { Module, MiddlewareConsumer,forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CurrentUserMiddleware } from './middlewares/current-user.middleware';
import { AuthModule } from '../auth/auth.module';


@Module({
    imports: [forwardRef(() => AuthModule), TypeOrmModule.forFeature([User])],
    controllers: [UsersController],
    providers: [ UsersService],
    exports: [UsersService]
})
export class UsersModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(CurrentUserMiddleware).forRoutes('*');
    }
}
