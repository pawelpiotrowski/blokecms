import { EmptyObject } from 'apollo-angular/types';

interface ScriptBase {
  _id: string;
  name: string;
}

export interface Script extends ScriptBase {
  formatted: string;
}

export interface ScriptMinified extends ScriptBase {
  minified: string;
}

export interface AllScriptsResponse {
  scripts: Script[];
}

export interface GetScriptResponse {
  script: Script;
}

export interface GetScriptMinifiedResponse {
  script: ScriptMinified;
}

export interface CreateScriptResponse {
  createScript: Script;
}

export interface UpdateScriptResponse {
  updateScript: Script;
}

export type CreateScriptInput = Omit<Script, '_id'>;

export type DeleteScriptResponse = EmptyObject;

export interface UpdateScriptInput extends Omit<ScriptBase, 'name'> {
  name?: string;
  formatted?: string;
}
