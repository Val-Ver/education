import { Injectable, signal, WritableSignal } from '@angular/core';
import { ArticleModel } from '../../models/article.model';

@Injectable({ providedIn: 'root' })
export class ArticlesStoreService {
  public articles: WritableSignal<ArticleModel[]> = signal<ArticleModel[]>([]);
  public currentPage: WritableSignal<number> = signal<number>(1);

  public readonly itemsPerPage = 7;

  setArticles(articles: ArticleModel[]): void {
    this.articles.set(articles);
  }

  setCurrentPage(page: number): void {
    this.currentPage.set(page);
  }
}
