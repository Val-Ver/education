import { ArticleModel } from '../../../models/article.model';

export interface PaginatedResult {
  items: ArticleModel[];
  totalCount: number;
}
