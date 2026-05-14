import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, switchMap } from 'rxjs';
import { ArticleModel } from '../../../models/article.model';
import { IArticlesDataService } from '../articles-data.interface';
import { PaginatedResult } from '../types/paginated-result.interface';
import { ArticleMapper } from '../mappers/article.mapper';
import { environment } from '../../../../environments/environment';

@Injectable()
export class HttpArticlesDataService implements IArticlesDataService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/articles`;

  getArticles(page: number, perPage: number): Observable<PaginatedResult> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', perPage.toString())
      .set('cumulative', 'false');

    return this.http
      .get<any>(this.baseUrl, { params })
      .pipe(map((res) => ArticleMapper.paginatedFromBackend(res)));
  }

  addArticle(article: Omit<ArticleModel, 'id'> & { id?: string }): Observable<ArticleModel[]> {
    const formData = new FormData();
    formData.append('title', article.heading);
    formData.append('content', article.content);
    if (article.id) formData.append('id', article.id);

    return this.http.post<any>(this.baseUrl, formData).pipe(
      switchMap(() => this.getArticles(1, 9999)),
      map((res) => res.items),
    );
  }

  updateArticle(article: ArticleModel): Observable<ArticleModel[]> {
    const formData = new FormData();
    formData.append('title', article.heading);
    formData.append('content', article.content);

    return this.http.patch<any>(`${this.baseUrl}/${article.id}`, formData).pipe(
      switchMap(() => this.getArticles(1, 9999)),
      map((res) => res.items),
    );
  }

  deleteArticle(id: string): Observable<ArticleModel[]> {
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
      switchMap(() => this.getArticles(1, 9999)),
      map((res) => res.items),
    );
  }
}
