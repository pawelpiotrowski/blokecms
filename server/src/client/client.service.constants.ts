import { appConfig } from '../app.config';
import { readFileSync } from 'fs';
import { join } from 'path';

const {
  ui: { admin: adminUi, public: publicUi, files: filesUi },
  gql,
  isDev,
  api,
} = appConfig();

export const configGql = gql;
export const configIsDev = isDev;
export const adminUrl = adminUi.url;
export const publicUrl = publicUi.url;
export const filesUrl = filesUi.url;
export const uiPublicBrowserBundleDirPath = `./${publicUi.dir}/browser`;
export const uiAdminBundleDirPath = `./${adminUi.dir}`;
export const uiFilesBundleDirPath = `./${filesUi.dir}`;
export const defaultMimeType = 'application/octet-stream';
export const rateLimit = api.rateLimit.clientFiles;
export const rateLimitDisabled = api.rateLimit.disabled;
export const getPublicServerBundleExceptionMessage =
  'Error getting public server bundle';
export const getAdminIndexHtmlExceptionMessage = 'Error getting admin bundle';
export const publicIndexHtml = readFileSync(
  join(process.cwd(), uiPublicBrowserBundleDirPath, 'index.html'),
  'utf-8',
).toString();
export const adminIndexHtml = readFileSync(
  join(process.cwd(), uiAdminBundleDirPath, 'index.html'),
  'utf-8',
).toString();
