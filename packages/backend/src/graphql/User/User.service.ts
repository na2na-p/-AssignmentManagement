import { Injectable } from '@nestjs/common';

import type { User } from '@/generated/schema';
import { UserUserableType } from '@/generated/schema';
import { PrismaService } from '@/prisma/prisma.service';
import { assertNever } from '@/utils/assertNever';

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

  async findById(id: string): Promise<User> {
    // TODO: クエリ見直し
    const user = await this.prismaService.user.findFirstOrThrow({
      where: { id },
      include: {
        student: true,
        staff: true,
      },
    });
    if (!user) {
      throw new Error('User not found');
    }

    const userableType = user.userableType;

    switch (userableType) {
      case UserUserableType.USER_USERABLE_TYPE_STUDENT:
        if (!user.student) {
          throw new Error('Student not found');
        }
        const student = await this.studentService.findById(user.student.id);

        return {
          __typename: 'User',
          id: user.id,
          email: user.email,
          userableType: UserUserableType.USER_USERABLE_TYPE_STUDENT,
          staff: null,
          student,
        };
      case UserUserableType.USER_USERABLE_TYPE_STAFF:
        if (!user.staff) {
          throw new Error('Staff not found');
        }
        const staff = await this.staffService.findById(user.staff.id);
        return {
          __typename: 'User',
          id: user.id,
          email: user.email,
          userableType: UserUserableType.USER_USERABLE_TYPE_STAFF,
          staff,
          student: null,
        };
      default:
        assertNever(userableType);
        throw new Error('UserableType not found');
    }
  }
}
