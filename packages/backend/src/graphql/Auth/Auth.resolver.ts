import { NotFoundException } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import type { AuthResponse } from '@/generated/types';
import { UserService } from '@/graphql/User/User.service';

import { AuthService } from './Auth.service';

@Resolver()
export class AuthResolver {
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  @Mutation()
  async signin(
    @Args('email') email: string,
    @Args('password') password: string
  ): Promise<AuthResponse> {
    const { userId, access_token } = await this.authService.signIn({
      email,
      password,
    });
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      user,
      token: access_token,
    };
  }
}
