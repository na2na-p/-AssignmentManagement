import { Injectable } from '@nestjs/common';

import { UserUserableType } from '@/generated/types';
import type {
  Student,
  StudentCreateInput,
  UserCreateInput,
} from '@/generated/types';
import { PrismaService } from '@/prisma/prisma.service';
import { createPasswordDigest } from '@/utils/createPasswordDigest';

const DEFAULT_STUDENT_MANAGER_ROLE = false;

@Injectable()
export class StudentService {
  constructor(private prismaService: PrismaService) {}

  async findById(id: string): Promise<Student | null> {
    const student = await this.prismaService.student.findFirstOrThrow({
      where: { id },
    });

    if (!student.classRoomId) {
      throw new Error('ClassRoom not found');
    }

    const classRoom = await this.prismaService.classRoom.findFirstOrThrow({
      where: { id: student.classRoomId },
    });

    return {
      id: student.id,
      name: student.name,
      classRoom,
      staffName: classRoom.staffName,
      studentNumber: student.studentNumber,
      selectedClassIds: student.selectedClassIds,
      hasManagerRole: student.hasManagerRole,
    };
  }

  async createStudent({
    studentId,
    userId,
    studentCreateInput,
    userCreateInput,
  }: {
    studentId: string;
    userId: string;
    studentCreateInput: StudentCreateInput;
    userCreateInput: UserCreateInput;
  }): Promise<Student> {
    const passwordDigest = await createPasswordDigest({
      password: userCreateInput.password,
    });

    const results = await this.prismaService.$transaction(async prisma => {
      const isUserExists = await prisma.user.findUnique({
        where: { email: userCreateInput.email },
      });
      if (isUserExists) {
        throw new Error('User already exists');
      }

      const student = await prisma.student.create({
        data: {
          id: studentId,
          name: studentCreateInput.name,
          userId,
          studentNumber: studentCreateInput.studentNumber,
          staffName: studentCreateInput.staffName,
          hasManagerRole:
            studentCreateInput.hasManagerRole ?? DEFAULT_STUDENT_MANAGER_ROLE,
        },
      });

      const user = await prisma.user.create({
        data: {
          id: userId,
          email: userCreateInput.email,
          userableType: UserUserableType.USER_USERABLE_TYPE_STAFF,
          passwordDigest,
          studentId,
        },
      });

      if (!user) {
        throw new Error('User create failed');
      }

      return student;
    });
    return {
      ...results,
      // TODO: classRoomの作成戦略見直す
      classRoom: [] as unknown as Student['classRoom'],
    };
  }
}
