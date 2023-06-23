import { Injectable } from '@nestjs/common';
import { AuthUserDecoded } from '../auth/auth.interface';
import { AuthService } from '../auth/auth.service';
import { CaslAbilityFactory } from './casl-ability.factory';
import { CaslAction, CaslSubjects } from './casl.interface';

@Injectable()
export class CaslService {
  constructor(
    private readonly caslAbilityFactory: CaslAbilityFactory,
    private readonly authService: AuthService,
  ) {}

  async hasAbility(
    user: AuthUserDecoded,
    action: CaslAction,
    subject: CaslSubjects,
  ) {
    const ability = await this.caslAbilityFactory.createForUser(user);

    return ability.can(action, subject);
  }

  async hasAbilityOrThrow(
    user: AuthUserDecoded,
    action: CaslAction,
    subject: CaslSubjects,
  ) {
    if (!(await this.hasAbility(user, action, subject))) {
      this.authService.throwForbidden();
    }
  }
}
