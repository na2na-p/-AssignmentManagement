import { Module } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

import { StaffResolver } from './Staff.resolver';
import { StaffService } from './Staff.service';

@Module({
  providers: [StaffService, StaffResolver, PrismaService],
  exports: [StaffService, StaffResolver],
})
export class StaffModule {}
