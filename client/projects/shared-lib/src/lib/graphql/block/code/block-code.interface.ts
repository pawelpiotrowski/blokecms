import { Block } from '../block.interface';

export interface BlockCode extends Block {
  code: string;
  lang: string;
  showLineNumbers: boolean;
}

export interface AllBlocksCodeResponse {
  blocksCode: BlockCode[];
}

export interface AllBlocksCodeCountResponse {
  blocksCodeCount: number;
}

export interface GetBlockCodeResponse {
  blockCode: BlockCode;
}

export interface CreateBlockCodeResponse {
  createBlockCode: BlockCode;
}

export type CreateBlockCodeInput = Omit<BlockCode, '_id'>;

export interface UpdateBlockCodeResponse {
  updateBlockCode: BlockCode;
}

export interface UpdateBlockCodeInput
  extends Omit<BlockCode, 'name' | 'code' | 'lang' | 'showLineNumbers'> {
  name?: string;
  code?: string;
  lang?: string;
  showLineNumbers?: boolean;
}
