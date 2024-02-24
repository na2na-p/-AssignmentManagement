import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { ViewerService } from './Viewer.service';

describe('ViewerService', () => {
  let service: ViewerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ViewerService],
    }).compile();

    service = module.get<ViewerService>(ViewerService);
  });

  it('should be defined', () => {
    expect(service.Viewer).toBeDefined();
  });
});
