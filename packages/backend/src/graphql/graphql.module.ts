import { join } from 'path';

import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { AuthModule } from '@graphql/Auth/Auth.module';
import { UserModule } from '@graphql/User/User.module';
import type { ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

import { ViewerModule } from './Viewer/Viewer.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      path: '/api',
      typePaths: [join(process.cwd(), '../schema/graphql/dist/schema.graphql')],
      definitions: {
        path: join(process.cwd(), 'src/generated/types.ts'),
        emitTypenameField: true,
        outputAs: 'class',
      },
      installSubscriptionHandlers: true,
      playground: false,
      // TODO: productionであればfalseになるように
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      context: ({ req }: { req: { headers: { authorization: string } } }) => ({
        req,
      }),
    }),
    ViewerModule,
    AuthModule,
    UserModule,
  ],
})
export class GraphQLServerModule {}
