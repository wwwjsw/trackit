export interface Source {
  id: string; // usually owner/repo
  owner: string;
  repo: string;
  lastChecked?: string;
}

export interface Release {
  id: number;
  tagName: string;
  name: string;
  body: string;
  publishedAt: string;
  htmlUrl: string;
  sourceId: string; // owner/repo
  isRead?: boolean;
}

export interface AppState {
  sources: Source[];
  releases: Release[];
  lastUpdated: string | null;
}
