import { Observable } from 'rxjs';
import { ArticleModel } from '../../models/article.model';
import { PaginatedResult } from './types/paginated-result.interface';

export interface IArticlesDataService {
  getArticles(page: number, perPage: number): Observable<PaginatedResult>;
  addArticle(
    article: Omit<ArticleModel, 'id'> & { id?: string },
    file?: File,
    categoryId?: string,
  ): Observable<ArticleModel[]>;
  updateArticle(
    article: ArticleModel,
    file?: File,
    categoryId?: string,
  ): Observable<ArticleModel[]>;
  deleteArticle(id: string): Observable<ArticleModel[]>;
}
