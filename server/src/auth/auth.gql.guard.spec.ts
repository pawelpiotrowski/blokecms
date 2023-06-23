import { AuthGqlGuard } from './auth.gql.guard';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { GqlExecutionContext } from '@nestjs/graphql';

jest.mock('@nestjs/graphql', () => ({
  GqlExecutionContext: {
    create: jest.fn().mockReturnThis(),
    getContext: jest.fn().mockReturnValue({ req: { test: true } }),
  },
}));

describe('AuthGqlGuard', () => {
  let guard: AuthGqlGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthGqlGuard],
    }).compile();

    guard = module.get<AuthGqlGuard>(AuthGqlGuard);
  });

  it('should be configured as passport "jwt" auth guard', () => {
    expect(guard).toBeInstanceOf(PassportAuthGuard('jwt'));
  });

  describe('getRequest', () => {
    it('should extract request from execution context', () => {
      const mockCtx: any = { foo: 'bar' };

      expect(guard.getRequest(mockCtx)).toEqual({ test: true });
      expect(GqlExecutionContext.create).toBeCalledWith(mockCtx);
    });
  });
});
