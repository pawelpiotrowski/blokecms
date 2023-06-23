import {
  AllArticlesCountResponse,
  AllBlocksCodeCountResponse,
  AllBlocksMediaCountResponse,
  AllBlocksTextCountResponse,
  AllPagesCountResponse,
} from 'shared-lib';

export interface DashboardInsightsLink {
  count: number;
  url: string;
  label: string;
}

export type DashboardInsightsZipResponseData =
  | AllPagesCountResponse
  | AllArticlesCountResponse
  | AllBlocksTextCountResponse
  | AllBlocksCodeCountResponse
  | AllBlocksMediaCountResponse;

export type DashboardInsightsZipResponse = [
  AllPagesCountResponse,
  AllArticlesCountResponse,
  AllBlocksTextCountResponse,
  AllBlocksCodeCountResponse,
  AllBlocksMediaCountResponse,
];

export interface DashboardInsightsCountAndLabelDto {
  count: number;
  singular: string;
  forceSingular?: boolean;
}
