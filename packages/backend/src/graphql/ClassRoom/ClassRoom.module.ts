import { Module } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

import { ClassRoomService } from './ClassRoom.service';

@Module({
  providers: [ClassRoomService, PrismaService],
  exports: [ClassRoomService],
})
export class ClassRoomModule {}
