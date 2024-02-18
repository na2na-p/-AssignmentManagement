import { Module } from '@nestjs/common';

import { ViewerResolver } from './Viewer.resolver';
import { ViewerService } from './Viewer.service';

@Module({
  providers: [ViewerResolver, ViewerService],
})
export class ViewerModule {}
