import { NotFoundException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from '../../auth/auth-user.decorator';
import { AuthGqlGuard } from '../../auth/auth.gql.guard';
import { AuthUserDecoded } from '../../auth/auth.interface';
import { CaslAction } from '../../casl/casl.interface';
import { CaslService } from '../../casl/casl.service';
import { AppSchemaId } from '../../common/common.interface';
import { User } from '../../user/user.schema';
import {
  ScriptInput,
  ScriptInputFilter,
  ScriptInputUpdate,
} from './script.dto';
import { Script } from './script.schema';
import { ScriptService } from './script.service';

export const scriptsQueryResolver = () => [Script];
export const scriptQueryResolver = () => Script;
export const scriptMutationResolver = () => Script;

@Resolver()
export class ScriptResolver {
  constructor(
    private readonly scriptService: ScriptService,
    private readonly caslService: CaslService,
  ) {}

  @Query(scriptsQueryResolver)
  async scripts() {
    return this.scriptService.findAll();
  }

  @Query(scriptQueryResolver)
  async script(@Args('input') input: ScriptInputFilter) {
    const foundScript = await this.scriptService.findOne(input);

    if (foundScript == null) {
      throw new NotFoundException('Script not found');
    }
    return foundScript;
  }

  @Mutation(scriptMutationResolver)
  @UseGuards(AuthGqlGuard)
  async createScript(
    @Args('input') input: ScriptInput,
    @AuthUser() user: User,
  ) {
    return this.scriptService.create({ authorId: user._id, ...input });
  }

  @Mutation(scriptMutationResolver)
  @UseGuards(AuthGqlGuard)
  async updateScript(
    @Args('input') input: ScriptInputUpdate,
    @AuthUser() user: User,
  ): Promise<Script> {
    await this.checkAbility(user, CaslAction.Update, input._id);

    return this.scriptService.update(input);
  }

  @Mutation(scriptMutationResolver)
  @UseGuards(AuthGqlGuard)
  async deleteScript(@Args('id') id: string, @AuthUser() user: User) {
    await this.checkAbility(user, CaslAction.Delete, id);

    return this.scriptService.deleteOne(id);
  }

  private async checkAbility(
    user: AuthUserDecoded,
    action: CaslAction,
    _id: AppSchemaId,
  ) {
    const script = await this.scriptService.findOne({ _id });

    if (script == null) {
      throw new NotFoundException('Script not found');
    }
    const scriptCheck = new Script();

    scriptCheck.authorId = script.authorId.toString();
    await this.caslService.hasAbilityOrThrow(user, action, scriptCheck);
  }
}
