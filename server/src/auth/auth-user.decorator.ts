import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

/**
 * Param decorator that extracts user from request
 */
export const AuthUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request =
      ctx.switchToHttp().getRequest() ||
      GqlExecutionContext.create(ctx).getContext().req;

    return request.user;
  },
);
