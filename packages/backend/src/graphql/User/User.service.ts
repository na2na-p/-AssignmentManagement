import { Injectable } from '@nestjs/common';

import type { User } from '@/generated/types';
import { UserUserableType } from '@/generated/types';
import { PrismaService } from '@/prisma/prisma.service';

import { ClassRoomService } from '../ClassRoom/ClassRoom.service';
import { StaffService } from '../Staff/Staff.service';
import { StudentService } from '../Student/Student.service';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private staffService: StaffService,
    private studentService: StudentService,
    private classRoomService: ClassRoomService
  ) {}

  async findById(id: string): Promise<User | undefined> {
    // TODO: クエリ見直し
    const user = await this.prismaService.user.findFirst({
      where: { id },
      include: {
        student: true,
        staff: true,
      },
    });
    if (!user) {
      throw new Error('User not found');
    }

    switch (user.userableType) {
      case UserUserableType.USER_USERABLE_TYPE_STUDENT:
        if (!user.student) {
          throw new Error('Student not found');
        }
        const student = await this.studentService.findById(user.student.id);

        return {
          id: user.id,
          email: user.email,
          userableType: UserUserableType.USER_USERABLE_TYPE_STUDENT,
          student,
        };

      case UserUserableType.USER_USERABLE_TYPE_STAFF:
        if (!user.staff) {
          throw new Error('Staff not found');
        }
        const staff = await this.staffService.findById(user.staff.id);
        return {
          id: user.id,
          email: user.email,
          userableType: UserUserableType.USER_USERABLE_TYPE_STAFF,
          staff,
        };
    }
  }
}
