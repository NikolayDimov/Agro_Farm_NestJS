import { Module, forwardRef } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { jwtConstants } from "./constants";
import { UsersModule } from "../users/users.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/users/user.entity";

@Module({
  imports: [
    forwardRef(() => UsersModule),
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: "4min" },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
