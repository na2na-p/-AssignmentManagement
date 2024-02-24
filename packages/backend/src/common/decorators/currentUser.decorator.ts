import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';

import type { UserPayload } from '@/common/strategy/jwt.strategy';

export const CurrentUser = createParamDecorator(
  (_: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const token = ctx.getContext().req.headers.authorization;
    const jwtService = new JwtService({
      secret: process.env.JWT_SECRET || 'yourSecretKey',
    });
    try {
      const user = jwtService.verify(token);
      return {
        userId: user.sub,
        username: user.username,
      } satisfies UserPayload;
    } catch (e) {
      return null;
    }
  }
);
