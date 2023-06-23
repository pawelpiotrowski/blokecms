import { Block } from '../block.interface';

export interface BlockMedia extends Block {
  url: string;
  isPortrait?: boolean;
  isSquare?: boolean;
  naturalHeight?: number;
  naturalWidth?: number;
}

export interface AllBlocksMediaResponse {
  blocksMedia: BlockMedia[];
}

export interface AllBlocksMediaCountResponse {
  blocksMediaCount: number;
}

export interface GetBlockMediaResponse {
  blockMedia: BlockMedia;
}

export interface CreateBlockMediaResponse {
  createBlockMedia: BlockMedia;
}

export interface UpdateBlockMediaResponse {
  updateBlockMedia: BlockMedia;
}

export interface UpdateBlockMediaInput extends Partial<BlockMedia> {
  _id: string;
}
