import { Args, Mutation, Resolver } from '@nestjs/graphql';

import type { Staff } from '@/generated/types';
import { StaffCreateInput, UserCreateInput } from '@/generated/types';
import { uuidv7 } from '@/utils/uuidv7';

import { StaffService } from './Staff.service';

@Resolver('Staff')
export class StaffResolver {
  constructor(private staffService: StaffService) {}

  @Mutation('createStaff')
  async createStaff(
    @Args('user') user: UserCreateInput,
    @Args('staff') staff: StaffCreateInput
  ): Promise<Staff> {
    const staffId = uuidv7();
    const userId = uuidv7();
    const createdStaff = await this.staffService.createStaff({
      staffId,
      userId,
      staffCreateInput: staff,
      userCreateInput: user,
    });
    console.log('createdStaff', createdStaff);
    return createdStaff;
  }
}
