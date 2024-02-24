import { UserService } from '@graphql/User/User.service';
import { Module } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

import { ViewerResolver } from './Viewer.resolver';
import { ViewerService } from './Viewer.service';
import { ClassRoomService } from '../ClassRoom/ClassRoom.service';
import { StaffService } from '../Staff/Staff.service';
import { StudentService } from '../Student/Student.service';

@Module({
  providers: [
    ViewerResolver,
    ViewerService,
    UserService,
    PrismaService,
    StaffService,
    StudentService,
    ClassRoomService,
  ],
})
export class ViewerModule {}
