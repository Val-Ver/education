import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

import { Observable, of } from 'rxjs';

import { ArticleModel } from '../../models/article.model';

import { IArticlesDataService } from './articles-data.interface';
import { PaginatedResult } from './types/paginated-result.interface';
import { INITIAL_ARTICLES } from '../../data/initial-articles';

@Injectable()
export class ArticlesDataService implements IArticlesDataService {
  private http = inject(HttpClient);
  private readonly STORAGE_KEY = 'articles';

  constructor() {
    if (!environment.useBackend) {
      this.initializeData();
    }
  }

  private initializeData(): void {
    const existing = localStorage.getItem(this.STORAGE_KEY);
    if (!existing) {
      this.saveLocalArticles(INITIAL_ARTICLES);
    }
  }
  private saveLocalArticles(articles: ArticleModel[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(articles));
  }

  private loadArticles(): ArticleModel[] {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  }

  getArticles(page: number, perPage: number): Observable<PaginatedResult> {
    if (environment.useBackend) {
      const url = `${environment.apiUrl}/articles?page=${page}&perPage=${perPage}`;
      return this.http.get<PaginatedResult>(url);
    } else {
      const allArticles = this.loadArticles();
      const totalCount = allArticles.length;
      const startIndex = (page - 1) * perPage;
      const items = allArticles.slice(startIndex, startIndex + perPage);
      return of({ items, totalCount });
    }
  }

  addArticle(article: Omit<ArticleModel, 'id'> & { id?: string }): Observable<ArticleModel[]> {
    if (environment.useBackend) {
      return this.http.post<ArticleModel[]>(`${environment.apiUrl}/articles`, article);
    } else {
      const allArticles = this.loadArticles();
      const newId = article.id || Date.now().toString();
      const newArticle: ArticleModel = {
        id: newId,
        heading: article.heading,
        content: article.content,
        dateTime: article.dateTime,
        img: article.img,
        rating: article.rating,
      };
      const updatedArticles = [...allArticles, newArticle];
      this.saveLocalArticles(updatedArticles);
      return of(updatedArticles);
    }
  }

  updateArticle(article: ArticleModel): Observable<ArticleModel[]> {
    if (environment.useBackend) {
      return this.http.put<ArticleModel[]>(`${environment.apiUrl}/articles/${article.id}`, article);
    } else {
      const allArticles = this.loadArticles();
      const index = allArticles.findIndex((a) => a.id === article.id);
      if (index !== -1) {
        allArticles[index] = article;
        this.saveLocalArticles(allArticles);
      }
      return of(allArticles);
    }
  }

  deleteArticle(id: string): Observable<ArticleModel[]> {
    if (environment.useBackend) {
      return this.http.delete<ArticleModel[]>(`${environment.apiUrl}/articles/${id}`);
    } else {
      const allArticles = this.loadArticles();
      const filteredArticles = allArticles.filter((a) => a.id !== id);
      this.saveLocalArticles(filteredArticles);
      return of(filteredArticles);
    }
  }
}
