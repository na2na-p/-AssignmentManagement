import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { ViewerResolver } from './Viewer.resolver';
import { ViewerService } from './Viewer.service';

describe('ViewerResolver', () => {
  let resolver: ViewerResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ViewerResolver, ViewerService],
    }).compile();

    resolver = module.get<ViewerResolver>(ViewerResolver);
  });

  it('should be defined', () => {
    expect(resolver.Viewer).toBeDefined();
  });
});
