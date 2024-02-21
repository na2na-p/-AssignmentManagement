import { NotFoundException } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import type { AuthResponse } from '@/generated/types';
import { SignInInput } from '@/generated/types';
import { UserService } from '@/graphql/User/User.service';

import { AuthService } from './Auth.service';

@Resolver('Auth')
export class AuthResolver {
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  @Mutation()
  async signIn(
    @Args('SignInInput') signInInput: SignInInput
  ): Promise<AuthResponse> {
    console.log('signInInput', signInInput);
    const { email, password } = signInInput;
    const { userId, access_token } = await this.authService.signIn({
      email,
      password,
    });
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    console.log('user', user);
    console.log('access_token', access_token);
    return {
      user,
      token: access_token,
    };
  }
}
