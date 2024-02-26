import { ClassRoomService } from '@graphql/ClassRoom/ClassRoom.service';
import { BadRequestException, Injectable } from '@nestjs/common';

import type {
  Student,
  StudentCreateInput,
  UserCreateInput,
} from '@/generated/schema';
import { UserUserableType } from '@/generated/schema';
import { PrismaService } from '@/prisma/prisma.service';
import { createPasswordDigest } from '@/utils/createPasswordDigest';

const DEFAULT_STUDENT_MANAGER_ROLE = false;

@Injectable()
export class StudentService {
  constructor(
    private prismaService: PrismaService,
    private classRoomService: ClassRoomService
  ) {}

  async findById(id: string): Promise<Student | null> {
    const student = await this.prismaService.student.findFirstOrThrow({
      where: { id },
    });

    if (!student.classRoomId) {
      throw new Error('ClassRoom not found');
    }

    const classRoom = await this.classRoomService.findById(student.classRoomId);

    return {
      __typename: 'Student',
      id: student.id,
      name: student.name,
      classRoom,
      staffName: student.staffName,
      studentNumber: student.studentNumber,
      attendanceNumber: student.attendanceNumber,
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

      if (!this.classRoomService.validateClassId(studentCreateInput.classId)) {
        throw new BadRequestException('クラス記号が正しい形式ではありません');
      }

      const classRoom =
        (await prisma.classRoom.findFirst({
          where: { classId: studentCreateInput.classId },
          select: { id: true },
        })) ??
        (await this.classRoomService.create({
          classId: studentCreateInput.classId,
          staffName: studentCreateInput.staffName,
        }));

      const student = await prisma.student.create({
        data: {
          id: studentId,
          name: studentCreateInput.name,
          userId,
          classRoomId: classRoom.id,
          studentNumber: studentCreateInput.studentNumber,
          attendanceNumber: studentCreateInput.attendanceNumber,
          staffName: studentCreateInput.staffName,
          hasManagerRole:
            studentCreateInput.hasManagerRole ?? DEFAULT_STUDENT_MANAGER_ROLE,
        },
      });

      const user = await prisma.user.create({
        data: {
          id: userId,
          email: userCreateInput.email,
          userableType: UserUserableType.USER_USERABLE_TYPE_STUDENT,
          passwordDigest,
          studentId,
        },
      });

      if (!user) {
        throw new Error('User create failed');
      }

      return student;
    });

    const classRoom = await this.classRoomService.findById(results.classRoomId);

    return {
      __typename: 'Student',
      id: results.id,
      name: results.name,
      classRoom,
      staffName: results.staffName,
      studentNumber: results.studentNumber,
      attendanceNumber: results.attendanceNumber,
      selectedClassIds: results.selectedClassIds,
      hasManagerRole: results.hasManagerRole,
    } as const;
  }
}
