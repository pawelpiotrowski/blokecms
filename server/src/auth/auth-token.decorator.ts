import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';
import { extractTokenFromRequest } from './auth.strategy';

/**
 * Param decorator that extracts auth token from `req.signedCookies[cookieName]`
 */
export const AuthToken = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request: Request =
      ctx.switchToHttp().getRequest() ||
      GqlExecutionContext.create(ctx).getContext().req;

    return extractTokenFromRequest(request);
  },
);
