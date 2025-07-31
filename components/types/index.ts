export interface Suggestion {
  id: string;
  text: string;
  opened: boolean;
  openedAt?: number;
  actionType?: 'copy' | 'search';
}

export interface SearchEngine {
  name: string;
  value: string;
  url: string;
}