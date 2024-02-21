import { StudentService } from '@graphql/Student/Student.service';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import type { Student } from '@/generated/types';
import { StudentCreateInput, UserCreateInput } from '@/generated/types';
import { uuidv7 } from '@/utils/uuidv7';

@Resolver('Student')
export class StudentResolver {
  constructor(private studentService: StudentService) {}

  @Mutation('createStudent')
  async createStudent(
    @Args('user') user: UserCreateInput,
    @Args('student') student: StudentCreateInput
  ): Promise<Student> {
    const studentId = uuidv7();
    const userId = uuidv7();

    const createdStudent = await this.studentService.createStudent({
      studentId,
      userId,
      studentCreateInput: student,
      userCreateInput: user,
    });

    return createdStudent;
  }
}
