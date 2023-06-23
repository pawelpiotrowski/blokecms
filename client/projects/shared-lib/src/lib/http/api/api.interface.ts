export interface ApiVersion {
  version: string;
}

export interface ApiUpload {
  url: string;
  name: string;
  isPortrait: boolean;
  isSquare: boolean;
  naturalHeight: number;
  naturalWidth: number;
}
