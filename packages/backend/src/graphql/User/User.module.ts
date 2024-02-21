import { Module } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

import { UserResolver } from './User.resolver';
import { UserService } from './User.service';
import { ClassRoomService } from '../ClassRoom/ClassRoom.service';
import { StaffService } from '../Staff/Staff.service';
import { StudentService } from '../Student/Student.service';

@Module({
  providers: [
    UserService,
    UserResolver,
    StaffService,
    PrismaService,
    ClassRoomService,
    StudentService,
  ],
  exports: [UserService],
})
export class UserModule {}
