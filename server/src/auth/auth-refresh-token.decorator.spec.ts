import { getParamDecoratorFactory } from '../../test/helpers/param.decorator.factory.helper';
import { AuthRefreshToken } from './auth-refresh-token.decorator';

jest.mock('./auth.strategy', () => ({
  extractRefreshTokenFromRequest: jest.fn().mockReturnValue('refresh-token'),
}));

jest.mock('@nestjs/graphql', () => ({
  GqlExecutionContext: {
    create: jest.fn().mockReturnThis(),
    getContext: jest.fn().mockReturnValue({}),
  },
}));

describe('AuthRefreshToken', () => {
  it('should extract refresh token from request for http context', () => {
    const factory = getParamDecoratorFactory(AuthRefreshToken);
    const mockHttpCtx = {
      switchToHttp: jest.fn().mockReturnThis(),
      getRequest: jest.fn().mockReturnValue({}),
    };
    const result = factory(null, mockHttpCtx);

    expect(result).toBe('refresh-token');
  });

  it('should extract token from request for gql context', () => {
    const factory = getParamDecoratorFactory(AuthRefreshToken);
    const mockGqlCtx = {
      switchToHttp: jest.fn().mockReturnThis(),
      getRequest: jest.fn().mockReturnValue(null),
    };
    const result = factory(null, mockGqlCtx);

    expect(result).toBe('refresh-token');
  });
});
