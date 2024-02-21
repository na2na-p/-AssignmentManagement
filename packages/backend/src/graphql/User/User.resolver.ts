import { NotFoundException } from '@nestjs/common';
import { Args, Resolver } from '@nestjs/graphql';

import type { User } from '@/generated/types';

import { UserService } from './User.service';

@Resolver('User')
export class UserResolver {
  constructor(private userService: UserService) {}

  async getUser(@Args('id', { type: () => String }) id: string): Promise<User> {
    const user = await this.userService.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // 他のクエリやミューテーションを追加可能
}
