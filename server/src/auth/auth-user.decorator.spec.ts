import { getParamDecoratorFactory } from '../../test/helpers/param.decorator.factory.helper';
import { AuthUser } from './auth-user.decorator';

const mockUser = { user: 'test' };

jest.mock('@nestjs/graphql', () => ({
  GqlExecutionContext: {
    create: jest.fn().mockReturnThis(),
    getContext: jest.fn().mockReturnValue({ req: { user: 'test' } }),
  },
}));

describe('AuthUser', () => {
  it('should extract user from request for http context', () => {
    const factory = getParamDecoratorFactory(AuthUser);
    const mockHttpCtx = {
      switchToHttp: jest.fn().mockReturnThis(),
      getRequest: jest.fn().mockReturnValue(mockUser),
    };
    const result = factory(null, mockHttpCtx);

    expect(result).toBe(mockUser.user);
  });

  it('should extract user from request for gql context', () => {
    const factory = getParamDecoratorFactory(AuthUser);
    const mockGqlCtx = {
      switchToHttp: jest.fn().mockReturnThis(),
      getRequest: jest.fn().mockReturnValue(null),
    };
    const result = factory(null, mockGqlCtx);

    expect(result).toBe(mockUser.user);
  });
});
