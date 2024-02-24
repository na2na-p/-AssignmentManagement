import { UserModule } from '@graphql/User/User.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { JwtStrategy } from '@/common/strategy/jwt.strategy';
import { AuthService } from '@/graphql/Auth/Auth.service';
import { PrismaService } from '@/prisma/prisma.service';

import { AuthResolver } from './Auth.resolver';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'yourSecretKey',
      signOptions: { expiresIn: '60m' },
    }),
    UserModule,
  ],
  providers: [AuthResolver, AuthService, JwtStrategy, PrismaService],
  exports: [AuthService],
})
export class AuthModule {}
