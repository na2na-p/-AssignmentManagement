import { ClassRoomService } from '@graphql/ClassRoom/ClassRoom.service';
import { StaffService } from '@graphql/Staff/Staff.service';
import { StudentService } from '@graphql/Student/Student.service';
import { UserService } from '@graphql/User/User.service';
import { Module } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

import { StudentResolver } from './Student.resolver';

@Module({
  providers: [
    StudentService,
    StudentResolver,
    UserService,
    StaffService,
    ClassRoomService,
    PrismaService,
  ],
  exports: [StudentService, StudentResolver],
})
export class StudentModule {}
