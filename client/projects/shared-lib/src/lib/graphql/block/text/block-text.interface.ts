import { Block } from '../block.interface';

export interface BlockText extends Block {
  text: string;
  jsonDoc: string;
  html: string;
  htmlIncludeWebComponentTags?: string;
}

export interface AllBlocksTextResponse {
  blocksText: BlockText[];
}

export interface AllBlocksTextCountResponse {
  blocksTextCount: number;
}

export interface GetBlockTextResponse {
  blockText: BlockText;
}

export interface CreateBlockTextResponse {
  createBlockText: BlockText;
}

export type CreateBlockTextInput = Omit<BlockText, '_id'>;

export interface UpdateBlockTextResponse {
  updateBlockText: BlockText;
}

export interface UpdateBlockTextInput extends Omit<BlockText, 'name'> {
  name?: string;
}
