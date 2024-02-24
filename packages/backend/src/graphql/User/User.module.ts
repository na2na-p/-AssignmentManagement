import { Module } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

import { UserResolver } from './User.resolver';
import { UserService } from './User.service';

@Module({
  providers: [UserService, UserResolver, PrismaService],
  exports: [UserService],
})
export class UserModule {}
