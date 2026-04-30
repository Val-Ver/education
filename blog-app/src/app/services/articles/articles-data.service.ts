import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ArticleModel } from '../../models/article.model';
import { IArticlesDataService, PaginatedResult } from './articles-data.interface';
import { INITIAL_ARTICLES } from '../../data/initial-articles';

@Injectable()
export class ArticlesDataService implements IArticlesDataService {
  private readonly STORAGE_KEY = 'articles';

  constructor() {
    this.initializeData();
  }

  private loadArticles(): ArticleModel[] {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  }

  private saveArticles(articles: ArticleModel[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(articles));
  }

  private initializeData(): void {
    const existing = localStorage.getItem(this.STORAGE_KEY);
    if (!existing) {
      this.saveArticles(INITIAL_ARTICLES);
    }
  }

  getArticles(page: number, perPage: number): Observable<PaginatedResult> {
    const allArticles = this.loadArticles();
    const totalCount = allArticles.length;
    const startIndex = (page - 1) * perPage;
    const items = allArticles.slice(startIndex, startIndex + perPage);

    return of({ items, totalCount });
  }

  addArticle(article: Omit<ArticleModel, 'id'> & { id?: string }): Observable<ArticleModel[]> {
    const allArticles = this.loadArticles();
    const newId = article.id || Date.now().toString();

    const newArticle: ArticleModel = {
      id: newId,
      heading: article.heading,
      content: article.content,
      dateTime: article.dateTime,
      img: article.img,
    };
    const updatedArticles = [...allArticles, newArticle];
    this.saveArticles(updatedArticles);
    return of(updatedArticles);
  }

  updateArticle(article: ArticleModel): Observable<ArticleModel[]> {
    const allArticles = this.loadArticles();
    const index = allArticles.findIndex((a) => a.id === article.id);

    if (index !== -1) {
      allArticles[index] = article;
      this.saveArticles(allArticles);
    }
    return of(allArticles);
  }

  deleteArticle(id: string): Observable<ArticleModel[]> {
    const allArticles = this.loadArticles();
    const filteredArticles = allArticles.filter((a) => a.id !== id);
    this.saveArticles(filteredArticles);

    return of(filteredArticles);
  }
}
