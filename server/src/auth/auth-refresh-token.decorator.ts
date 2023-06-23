import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';
import { extractRefreshTokenFromRequest } from './auth.strategy';

/**
 * Param decorator that extracts auth refresh token from `req.signedCookies[cookieName]`
 */
export const AuthRefreshToken = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request: Request =
      ctx.switchToHttp().getRequest() ||
      GqlExecutionContext.create(ctx).getContext().req;

    return extractRefreshTokenFromRequest(request);
  },
);
