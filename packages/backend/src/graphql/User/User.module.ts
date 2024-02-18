import { Module } from '@nestjs/common';

import { UserResolver } from './User.resolver';
import { UserService } from './User.service';

@Module({
  providers: [UserService, UserResolver],
})
export class UserModule {}