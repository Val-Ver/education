import { BehaviorSubject } from 'rxjs';
import { ArticleModel } from '../../models/article.model';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ArticlesStoreService {
  public articles$ = new BehaviorSubject<ArticleModel[]>([]);
  public currentPage$ = new BehaviorSubject<number>(1);
  public readonly itemsPerPage = 7;

  setArticles(articles: ArticleModel[]): void {
    this.articles$.next(articles);
  }

  setCurrentPage(page: number): void {
    this.currentPage$.next(page);
  }

}
