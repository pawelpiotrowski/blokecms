import { registerEnumType } from '@nestjs/graphql';

export enum BlockCodeLang {
  typescript = 'typescript',
  javascript = 'javascript',
  markup = 'markup',
  css = 'css',
}

registerEnumType(BlockCodeLang, {
  name: 'BlockCodeLang',
});
