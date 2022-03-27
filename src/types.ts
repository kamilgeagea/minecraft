/**
 * File where we store types
 */

import { Block } from "./models";

export interface Chunk {
  [key: string]: Block;
}

export interface Chunks {
  [key: string]: Chunk;
}

export interface CurrentChunk {
  value: string;
}
