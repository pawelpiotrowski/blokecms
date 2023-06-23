import { registerAs } from '@nestjs/config';
import { configDefault } from './app.config.default';
import {
  AppConfig,
  AppConfigApi,
  AppConfigDb,
  AppConfigGql,
  AppConfigHttp,
  AppConfigUi,
  AppConfigUiDir,
  DotEnvValidate,
  DotEnvVar,
  gqlSchemaFile,
  NodeEnv,
} from './app.config.interface';
import { version } from './version';

export const appConfigNameSpace = 'appConfig';

/**
 * Registered with `ConfigService` under `appConfig` namespace
 * For Accepted `process.env` or `.env` file variables,
 * see server/src/app.config.interface.ts -> DotEnvVar
 *
 * @type {AppConfig}
 */
export const appConfig = registerAs(appConfigNameSpace, (): AppConfig => {
  const nodeEnvStrings: NodeEnv[] = Object.keys(NodeEnv)
    .map((k) => NodeEnv[k])
    .map((v) => v as NodeEnv);
  const processEnvNodeEnv = process.env[DotEnvVar.nodeEnv] as NodeEnv;
  const nodeEnv = nodeEnvStrings.includes(processEnvNodeEnv)
    ? processEnvNodeEnv
    : NodeEnv.DEV;
  const isDev = nodeEnv === NodeEnv.DEV;
  const isProd = nodeEnv === NodeEnv.PROD;
  const isTest = nodeEnv === NodeEnv.TEST;
  const http: AppConfigHttp = {
    port: configDefault.http.port,
  };
  const requireHttps =
    typeof process.env[DotEnvVar.authCookiesRequireHttps] === 'string'
      ? process.env[DotEnvVar.authCookiesRequireHttps] === 'true'
      : undefined;
  const api: AppConfigApi = {
    url: configDefault.api.url,
    auth: {
      ...configDefault.api.auth,
      cookieName: process.env[DotEnvVar.authCookieName],
      refreshCookieName: process.env[DotEnvVar.authRefreshCookieName],
      ...(requireHttps != null && { requireHttps }),
    },
    rateLimit: {
      ...configDefault.api.rateLimit,
    },
  };
  const ui: AppConfigUi = {
    admin: {
      dir: AppConfigUiDir.ADMIN,
      url: configDefault.ui.admin.url,
    },
    public: {
      dir: AppConfigUiDir.PUBLIC,
      url: configDefault.ui.public.url,
    },
    files: {
      dir: AppConfigUiDir.FILES,
      url: configDefault.ui.files.url,
    },
  };
  const db: AppConfigDb = {
    url: process.env.DB_URL || configDefault.db.url,
  };
  const gql: AppConfigGql = {
    autoSchemaFile: configDefault.gql.enableInMemorySchema || gqlSchemaFile,
    url: configDefault.gql.url,
  };

  const hasEnvVars =
    process.env[DotEnvValidate.existsKey] === DotEnvValidate.existsVal;

  return {
    nodeEnv,
    isDev,
    isProd,
    isTest,
    version,
    http,
    api,
    ui,
    db,
    gql,
    hasEnvVars,
  };
});
