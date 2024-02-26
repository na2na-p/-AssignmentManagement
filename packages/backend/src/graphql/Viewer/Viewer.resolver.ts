import { UserService } from '@graphql/User/User.service';
import { Query, Resolver } from '@nestjs/graphql';

import { CurrentUser } from '@/common/decorators/currentUser.decorator';
import { UserPayload } from '@/common/strategy/jwt.strategy';
import type { Viewer } from '@/generated/resolvers';

import { ViewerService } from './Viewer.service';

@Resolver('Viewer')
export class ViewerResolver {
  constructor(
    private readonly viewerService: ViewerService,
    private readonly userService: UserService
  ) {}

  @Query()
  async Viewer(@CurrentUser() currentUser?: UserPayload): Promise<Viewer> {
    if (!currentUser) {
      return {
        assignedSubjects: null,
        me: null,
      };
    }

    const me = await this.userService.findById(currentUser.userId);
    const assignedSubjectsRaw = await this.viewerService.getAssignedSubjects(
      currentUser.userId
    );
    const assignedSubjects = assignedSubjectsRaw
      ? assignedSubjectsRaw.map(
          subject =>
            ({
              ...subject,
              __typename: 'Subject',
            }) as const
        )
      : null;

    return {
      assignedSubjects,
      me,
    };
  }
}
