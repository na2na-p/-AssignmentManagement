// logging.interceptor.ts
import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { Injectable, Logger } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import type { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const ctx = GqlExecutionContext.create(context);
    const resolverName = ctx.getClass().name;
    const info = ctx.getInfo();

    const now = Date.now();
    const { fieldName, parentType } = info;

    this.logger.log(`Before... ${parentType} "${fieldName}"`);
    this.logger.log(`Resolver: ${resolverName}`);

    return next
      .handle()
      .pipe(
        tap(() =>
          this.logger.log(
            `After... ${parentType} "${fieldName}" ${Date.now() - now}ms`
          )
        )
      );
  }
}
