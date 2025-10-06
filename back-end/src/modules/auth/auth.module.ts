import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from '../../passport/local.strategy';
import { JwtStrategy } from '../../passport/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  imports: [
    PassportModule.register({ defaultStrategy: 'local' }),
    UserModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Use a default secret key if not set in environment variables
      signOptions: { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRE }, // Token expiration time
    }),
  ],
})
export class AuthModule {}
