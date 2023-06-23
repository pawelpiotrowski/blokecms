/**
 * Environment configuration
 */
export enum NodeEnv {
  DEV = 'development',
  PROD = 'production',
  TEST = 'test',
}

/**
 * .env vars validation helper
 * `process.env[DotEnvValidate.existsKey] === DotEnvValidate.existsVal`
 */
export enum DotEnvValidate {
  existsVal = 'YES',
  existsKey = 'DOT_ENV_VAR_EXISTS',
}

/**
 * .env vars helper for accessing via nest ConfigService
 * `ConfigService.get<type>(DotEnvVar.var)`
 * or
 * `process.env[DotEnvVar.var]`
 */
export enum DotEnvVar {
  nodeEnv = 'NODE_ENV',
  dbUrl = 'DB_URL',
  jwtKey = 'JWT_KEY',
  authCookieSignSecret = 'AUTH_COOKIE_SIGN_SECRET',
  authCookieName = 'AUTH_COOKIE_NAME',
  authRefreshCookieName = 'AUTH_REFRESH_COOKIE_NAME',
  authCookiesRequireHttps = 'AUTH_COOKIES_REQUIRE_HTTPS',
  adminSeedUserName = 'ADMIN_SEED',
}

export const gqlSchemaFile = 'schema.gql';

export interface AppVersion {
  version: string;
}

export interface AppRateLimit {
  ttl: number;
  limit: number;
}

export interface AppApiRateLimit {
  clientFiles: AppRateLimit;
  loginAttempts: AppRateLimit;
  disabled: boolean;
  ignoreUserAgents?: string[];
}

/**
 * Default config partials
 */
export interface ConfigDefaultGql {
  enableInMemorySchema: boolean;
  url: string;
}

export interface ConfigDefaultUiCommon {
  url: string;
}

export interface ConfigDefaultUi {
  admin: ConfigDefaultUiCommon;
  public: ConfigDefaultUiCommon;
  files: ConfigDefaultUiCommon;
}

export interface ConfigDefaultAuth {
  url: string;
  expiresIn: MsStringValue;
  refreshExpiresIn: MsStringValue;
  endpoints: AppConfigAuthEndpoints;
}

export interface ConfigDefaultAuthApi {
  url: string;
  auth: ConfigDefaultAuth;
}

export interface ConfigDefaultApiRateLimit {
  rateLimit: AppApiRateLimit;
}

/**
 * App configuration partials
 */
export interface AppConfigHttp {
  port: number;
}

export interface AppConfigAuthEndpoints {
  login: string;
  logout: string;
  whoami: string;
  refresh: string;
  role: string;
  pwdChange: string;
}

export interface AppConfigAuth extends ConfigDefaultAuth {
  cookieName: string;
  refreshCookieName: string;
  requireHttps?: boolean;
}

export interface AppConfigApi extends ConfigDefaultApiRateLimit {
  url: string;
  auth: AppConfigAuth;
}

export enum AppConfigUiDir {
  PUBLIC = 'ui-public',
  ADMIN = 'ui-admin',
  FILES = 'ui-files',
}

export interface AppConfigUiCommon extends ConfigDefaultUiCommon {
  dir: AppConfigUiDir;
}

export interface AppConfigUi {
  admin: AppConfigUiCommon;
  public: AppConfigUiCommon;
  files: AppConfigUiCommon;
}

export interface AppConfigDb {
  url: string;
}

export interface AppConfigGql
  extends Omit<ConfigDefaultGql, 'enableInMemorySchema'> {
  autoSchemaFile: typeof gqlSchemaFile | true;
}

/**
 * Default configuration
 */
export interface ConfigDefault {
  http: AppConfigHttp;
  api: ConfigDefaultAuthApi & ConfigDefaultApiRateLimit;
  ui: ConfigDefaultUi;
  db: AppConfigDb;
  gql: ConfigDefaultGql;
}

/**
 * App configuration
 */
export interface AppConfig extends Omit<ConfigDefault, 'gql' | 'ui' | 'api'> {
  /**
   * Version from package.json
   */
  version: string;
  /**
   * NODE_ENV
   */
  nodeEnv: NodeEnv;
  /**
   * Shortcut for `nodeEnv === NodeEnv.DEV`
   */
  isDev: boolean;
  /**
   * Shortcut for `nodeEnv === NodeEnv.PROD`
   */
  isProd: boolean;
  /**
   * Shortcut for `nodeEnv === NodeEnv.TEST`
   */
  isTest: boolean;
  /**
   * Parsed version of default api config from yaml
   */
  api: AppConfigApi;
  /**
   * Parsed version of default ui config from yaml
   */
  ui: AppConfigUi;
  /**
   * Parsed version of default gql config from yaml
   */
  gql: AppConfigGql;
  /**
   * Helper for checking required env vars
   */
  hasEnvVars: boolean;
}

/**
 * ms package types
 */
type Unit =
  | 'Years'
  | 'Year'
  | 'Yrs'
  | 'Yr'
  | 'Y'
  | 'Weeks'
  | 'Week'
  | 'W'
  | 'Days'
  | 'Day'
  | 'D'
  | 'Hours'
  | 'Hour'
  | 'Hrs'
  | 'Hr'
  | 'H'
  | 'Minutes'
  | 'Minute'
  | 'Mins'
  | 'Min'
  | 'M'
  | 'Seconds'
  | 'Second'
  | 'Secs'
  | 'Sec'
  | 's'
  | 'Milliseconds'
  | 'Millisecond'
  | 'Msecs'
  | 'Msec'
  | 'Ms';

type UnitAnyCase = Unit | Uppercase<Unit> | Lowercase<Unit>;

export type MsStringValue =
  | `${number}`
  | `${number}${UnitAnyCase}`
  | `${number} ${UnitAnyCase}`;
