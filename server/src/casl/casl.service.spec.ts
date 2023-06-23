import { Test, TestingModule } from '@nestjs/testing';
import { mockUser } from '../../test/helpers/user.dto.helper';
import { AuthService } from '../auth/auth.service';
import { CaslAbilityFactory } from './casl-ability.factory';
import { CaslAction } from './casl.interface';
import { CaslService } from './casl.service';

jest.mock('../auth/auth.service');
jest.mock('./casl-ability.factory');

describe('CaslService', () => {
  let service: CaslService;
  let authService: AuthService;
  let caslAbilityFactory: CaslAbilityFactory;
  const user = mockUser();
  const action = CaslAction.Create;
  const subject = 'all';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CaslService, AuthService, CaslAbilityFactory],
    }).compile();

    service = module.get<CaslService>(CaslService);
    authService = module.get<AuthService>(AuthService);
    caslAbilityFactory = module.get<CaslAbilityFactory>(CaslAbilityFactory);
  });

  describe('hasAbility', () => {
    it('should create ability for a user and return it for given action and subject', async () => {
      const mockAbilityResult = false;
      const mockAbility = { can: jest.fn().mockReturnValue(mockAbilityResult) };
      (caslAbilityFactory.createForUser as jest.Mock).mockResolvedValueOnce(
        mockAbility,
      );
      const ability = await service.hasAbility(user, action, subject);

      expect(caslAbilityFactory.createForUser).toHaveBeenLastCalledWith(user);
      expect(mockAbility.can).toBeCalledWith(action, subject);
      expect(ability).toEqual(mockAbilityResult);
    });
  });

  describe('hasAbilityOrThrow', () => {
    it('should throw via auth service if no ability found', async () => {
      const spyOnHasAbilityTrue = jest
        .spyOn(service, 'hasAbility')
        .mockResolvedValueOnce(true);

      await service.hasAbilityOrThrow(user, action, subject);

      expect(spyOnHasAbilityTrue).toHaveBeenLastCalledWith(
        user,
        action,
        subject,
      );
      expect(authService.throwForbidden).not.toBeCalled();

      const spyOnHasAbilityFalse = jest
        .spyOn(service, 'hasAbility')
        .mockResolvedValueOnce(false);

      await service.hasAbilityOrThrow(user, action, subject);

      expect(spyOnHasAbilityFalse).toBeCalled();
      expect(authService.throwForbidden).toBeCalled();
    });
  });
});
