import { Injectable } from '@angular/core';
import { ArticleModel } from '../models/article.model';
import { INITIAL_ARTICLES } from '../data/initial-articles';

@Injectable({
  providedIn: 'root',
})
export class ArticlesService {
  private articlesKey = 'articles';
  private articles: ArticleModel[] = [];

  getArticles(): ArticleModel[] {
    let raw = localStorage.getItem(this.articlesKey);
    if (!raw) {
      this.saveArticles(INITIAL_ARTICLES);
    }
    return JSON.parse(localStorage.getItem(this.articlesKey)!);
  }

  private saveArticles(articles: ArticleModel[]): void {
    localStorage.setItem(this.articlesKey, JSON.stringify(articles));
  }

  addArticle(article: ArticleModel): void {
    const articles = this.getArticles();
    articles.push(article);
    this.saveArticles(articles);
  }

  deleteArticle(id: string): void {
    let articles = this.getArticles();
    articles = articles.filter((a) => a.id !== id);
    this.saveArticles(articles);
  }

}
