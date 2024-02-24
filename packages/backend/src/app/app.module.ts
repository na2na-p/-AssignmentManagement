import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { GraphQLServerModule } from '@/graphql/graphql.module';
import { LoggingInterceptor } from '@/utils/logging.interceptor';

@Module({
  imports: [GraphQLServerModule, ConfigModule.forRoot()],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
