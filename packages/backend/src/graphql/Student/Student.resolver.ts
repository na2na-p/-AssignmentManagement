import { StudentService } from '@graphql/Student/Student.service';
import { UserService } from '@graphql/User/User.service';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import type { User } from '@/generated/types';
import { StudentCreateInput, UserCreateInput } from '@/generated/types';
import { uuidv7 } from '@/utils/uuidv7';

@Resolver('Student')
export class StudentResolver {
  constructor(
    private studentService: StudentService,
    private userService: UserService
  ) {}

  @Mutation('createStudent')
  async createStudent(
    @Args('user') user: UserCreateInput,
    @Args('student') student: StudentCreateInput
  ): Promise<User> {
    const studentId = uuidv7();
    const userId = uuidv7();

    void (await this.studentService.createStudent({
      studentId,
      userId,
      studentCreateInput: student,
      userCreateInput: user,
    }));

    const createdStudent = await this.userService.findById(userId);
    if (!createdStudent) {
      throw new Error('User not found');
    }

    return createdStudent;
  }
}
