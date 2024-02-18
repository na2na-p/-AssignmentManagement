import { UserService } from '@graphql/User/User.service';
import { Module } from '@nestjs/common';

import { ViewerResolver } from './Viewer.resolver';
import { ViewerService } from './Viewer.service';

@Module({
  providers: [ViewerResolver, ViewerService, UserService],
})
export class ViewerModule {}
