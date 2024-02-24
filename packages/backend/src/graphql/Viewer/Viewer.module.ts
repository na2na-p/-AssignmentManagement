import { UserService } from '@graphql/User/User.service';
import { Module } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

import { ViewerResolver } from './Viewer.resolver';
import { ViewerService } from './Viewer.service';

@Module({
  providers: [ViewerResolver, ViewerService, UserService, PrismaService],
})
export class ViewerModule {}
