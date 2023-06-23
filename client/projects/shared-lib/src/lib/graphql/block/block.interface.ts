import { EmptyObject } from 'apollo-angular/types';
import { BlockCode } from './code';
import { BlockMedia } from './media';
import { BlockText } from './text';

export enum BlockType {
  Text = 'text',
  Media = 'media',
  Code = 'code',
}

export interface Block {
  _id: string;
  name: string;
  authorId?: string;
  kind?: BlockType;
  createdAt?: string;
  updatedAt?: string;
}

export interface GetBlockNameResponse {
  blockName: string;
}

export interface GetBlocksByNameResponse {
  findBlocksByName: [BlockText, BlockMedia, BlockCode];
}

export type DeleteBlockResponse = EmptyObject;
