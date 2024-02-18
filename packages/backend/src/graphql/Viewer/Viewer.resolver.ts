import { Query, Resolver } from '@nestjs/graphql';

import type { Viewer } from '@/generated/types';
import type { Typename } from '@/types/Typename';

import { ViewerService } from './Viewer.service';

@Resolver('Viewer')
export class ViewerResolver {
  constructor(private readonly ViewerService: ViewerService) {}

  @Query('Viewer' satisfies Typename<Viewer>)
  Viewer() {
    return this.ViewerService.Viewer();
  }
}
