import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';
import { ConfigDefault } from './app.config.interface';

const configDefaultFileName = 'config.default.yaml';

export const configDefault = yaml.load(
  readFileSync(join(__dirname, '..', '..', configDefaultFileName), 'utf8'),
) as ConfigDefault;
