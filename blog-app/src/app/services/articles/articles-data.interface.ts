import { Observable } from 'rxjs';
import { ArticleModel } from '../../models/article.model';

export interface PaginatedResult {
  items: ArticleModel[];
  totalCount: number;
}

export interface IArticlesDataService {
  getArticles(page: number, perPage: number): Observable<PaginatedResult>;
  addArticle(article: Omit<ArticleModel, 'id'> & { id?: string }): Observable<ArticleModel[]>;
  updateArticle(article: ArticleModel): Observable<ArticleModel[]>;
  deleteArticle(id: string): Observable<ArticleModel[]>;
}
