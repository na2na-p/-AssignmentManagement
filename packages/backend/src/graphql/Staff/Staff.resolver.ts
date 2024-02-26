import { UserService } from '@graphql/User/User.service';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import type { User } from '@/generated/resolvers';
import { StaffCreateInput, UserCreateInput } from '@/generated/schema';
import { uuidv7 } from '@/utils/uuidv7';

import { StaffService } from './Staff.service';

@Resolver('Staff')
export class StaffResolver {
  constructor(
    private staffService: StaffService,
    private userService: UserService
  ) {}

  @Mutation('createStaff')
  async createStaff(
    @Args('user') user: UserCreateInput,
    @Args('staff') staff: StaffCreateInput
  ): Promise<User> {
    const staffId = uuidv7();
    const userId = uuidv7();
    void (await this.staffService.createStaff({
      staffId,
      userId,
      staffCreateInput: staff,
      userCreateInput: user,
    }));
    const createdUser = await this.userService.findById(userId);
    if (!createdUser) {
      throw new Error('User not found');
    }
    return createdUser;
  }
}
