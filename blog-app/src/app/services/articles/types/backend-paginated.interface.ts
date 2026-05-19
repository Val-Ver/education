import { BackendArticle } from './backend-article.interface';

export interface BackendPaginatedResult {
  items: BackendArticle[];
  total: number;
  page: number;
  limit: number;
}
