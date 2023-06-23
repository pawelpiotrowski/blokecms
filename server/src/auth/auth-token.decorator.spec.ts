import { getParamDecoratorFactory } from '../../test/helpers/param.decorator.factory.helper';
import { AuthToken } from './auth-token.decorator';

jest.mock('./auth.strategy', () => ({
  extractTokenFromRequest: jest.fn().mockReturnValue('token'),
}));

jest.mock('@nestjs/graphql', () => ({
  GqlExecutionContext: {
    create: jest.fn().mockReturnThis(),
    getContext: jest.fn().mockReturnValue({}),
  },
}));

describe('AuthToken', () => {
  it('should extract token from request for http context', () => {
    const factory = getParamDecoratorFactory(AuthToken);
    const mockHttpCtx = {
      switchToHttp: jest.fn().mockReturnThis(),
      getRequest: jest.fn().mockReturnValue({}),
    };
    const result = factory(null, mockHttpCtx);

    expect(result).toBe('token');
  });

  it('should extract token from request for gql context', () => {
    const factory = getParamDecoratorFactory(AuthToken);
    const mockGqlCtx = {
      switchToHttp: jest.fn().mockReturnThis(),
      getRequest: jest.fn().mockReturnValue(null),
    };
    const result = factory(null, mockGqlCtx);

    expect(result).toBe('token');
  });
});
