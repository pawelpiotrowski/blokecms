import {
  AbilityBuilder,
  createMongoAbility,
  ExtractSubjectType,
  MongoAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { AuthUserDecoded } from '../auth/auth.interface';
import { UserService } from '../user/user.service';
import { Page } from '../page/page.schema';
import { CaslAction, CaslSubjects } from './casl.interface';
import { Block } from '../block/block.schema';
import { Article } from '../article/article.schema';
import { Navigation } from '../settings/navigation/navigation.schema';
import { Style } from '../settings/style/style.schema';

@Injectable()
export class CaslAbilityFactory {
  constructor(private readonly userService: UserService) {}

  async createForUser(authUserDecoded: AuthUserDecoded) {
    const { can, build } = new AbilityBuilder<
      MongoAbility<[CaslAction, CaslSubjects]>
    >(createMongoAbility);
    const { _id } = authUserDecoded;
    const user = await this.userService.findOne({ _id });

    if (user.isAdmin) {
      can(CaslAction.Manage, 'all'); // read-write access to everything
    } else {
      can(CaslAction.Read, 'all'); // read-only access to everything
    }

    // PAGE
    can(CaslAction.Delete, Page, { authorId: _id });
    can(CaslAction.Update, Page, { authorId: _id });

    // ARTICLE
    can(CaslAction.Delete, Article, { authorId: _id });
    can(CaslAction.Update, Article, { authorId: _id });

    // BLOCK
    can(CaslAction.Delete, Block, { authorId: _id });
    can(CaslAction.Update, Block, { authorId: _id });

    // NAVIGATION
    can(CaslAction.Delete, Navigation, { authorId: _id });
    can(CaslAction.Update, Navigation, { authorId: _id });

    // STYLE
    can(CaslAction.Delete, Style, { authorId: _id });
    can(CaslAction.Update, Style, { authorId: _id });

    return build({
      // Read https://casl.js.org/v5/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<CaslSubjects>,
    });
  }
}
