import { UserService } from '@graphql/User/User.service';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { ViewerResolver } from './Viewer.resolver';
import { ViewerService } from './Viewer.service';

describe('ViewerResolver', () => {
  let resolver: ViewerResolver;
  let viewerService: ViewerService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ViewerResolver,
        {
          provide: ViewerService,
          useValue: {
            getAssignedSubjects: jest
              .fn()
              .mockResolvedValue(['Subject1', 'Subject2']),
          },
        },
        {
          provide: UserService,
          useValue: {
            findById: jest
              .fn()
              .mockResolvedValue({ id: '1', name: 'Test User' }),
          },
        },
      ],
    }).compile();

    resolver = module.get<ViewerResolver>(ViewerResolver);
    viewerService = module.get<ViewerService>(ViewerService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('returns null for both assignedSubjects and me if currentUser is not provided', async () => {
    const result = await resolver.Viewer();
    expect(result).toEqual({ assignedSubjects: null, me: null });
  });

  it('returns assignedSubjects and me for an authenticated currentUser', async () => {
    const currentUser = { userId: '1', username: 'Test User' };
    const result = await resolver.Viewer(currentUser);
    expect(result).toEqual({
      assignedSubjects: ['Subject1', 'Subject2'],
      me: { id: currentUser.userId, name: currentUser.username },
    });
    expect(viewerService.getAssignedSubjects).toHaveBeenCalledWith('1');
    expect(userService.findById).toHaveBeenCalledWith('1');
  });
});
