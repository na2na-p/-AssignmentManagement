import { ClassRoomService } from '@graphql/ClassRoom/ClassRoom.service';
import { StudentService } from '@graphql/Student/Student.service';
import { UserService } from '@graphql/User/User.service';
import { Module } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

import { StaffResolver } from './Staff.resolver';
import { StaffService } from './Staff.service';

@Module({
  providers: [
    StaffService,
    StaffResolver,
    UserService,
    PrismaService,
    ClassRoomService,
    StudentService,
  ],
  exports: [StaffService, StaffResolver],
})
export class StaffModule {}
