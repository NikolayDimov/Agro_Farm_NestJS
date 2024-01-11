import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
// import { CookieSession } from 'cookie-session';  // if import not work because tsconfig.json
// const cookieSession = require('cookie-session');


async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    // app.use(cookieSession({
    //     keys: ['superCookie']   // encript information that is stored inside the cookie
    // }))
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
        }),
    );
    await app.listen(3000);
}
bootstrap();
