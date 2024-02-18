import { UserService } from '@graphql/User/User.service';
import { Query, Resolver } from '@nestjs/graphql';

import type { Viewer } from '@/generated/types';
import type { Typename } from '@/types/Typename';

import { ViewerService } from './Viewer.service';

@Resolver('Viewer')
export class ViewerResolver {
  constructor(
    private readonly ViewerService: ViewerService,
    private readonly userService: UserService
  ) {}

  @Query('Viewer' satisfies Typename<Viewer>)
  Viewer() {
    const me = this.userService.findById('1');

    return {
      assignedSubjects: null,
      me,
    };
  }
}
