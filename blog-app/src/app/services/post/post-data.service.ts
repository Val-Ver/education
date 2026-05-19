import { inject, Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

import { map, Observable, of, switchMap, throwError } from 'rxjs';
import { ArticleModel } from '../../models/article.model';
import { CommentModel } from '../../models/comment.model';
import { INITIAL_COMMENTS } from '../../data/initial-comments';

@Injectable({
  providedIn: 'root',
})
export class PostDataService {
  private readonly COMMENTS_STORAGE_KEY = 'blog_comments';
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  constructor() {
    if (!environment.useBackend) {
      this.initializeComments();
    }
  }

  private initializeComments(): void {
    const existing = localStorage.getItem(this.COMMENTS_STORAGE_KEY);
    if (!existing) {
      this.saveAllComments(INITIAL_COMMENTS);
    }
  }
  private saveAllComments(comments: CommentModel[]): void {
    localStorage.setItem(this.COMMENTS_STORAGE_KEY, JSON.stringify(comments));
  }

  private loadAllComments(): CommentModel[] {
    const raw = localStorage.getItem(this.COMMENTS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  }

  private loadAllArticles(): ArticleModel[] {
    const raw = localStorage.getItem('articles');
    if (!raw) return [];
    return JSON.parse(raw);
  }
  private saveAllArticles(articles: ArticleModel[]): void {
    localStorage.setItem('articles', JSON.stringify(articles));
  }

  private updateArticleInStorage(updatedArticle: ArticleModel): void {
    const articles = this.loadAllArticles();
    const index = articles.findIndex((a) => a.id === updatedArticle.id);
    if (index !== -1) {
      articles[index] = updatedArticle;
      this.saveAllArticles(articles);
    }
  }

  getPostById(id: string): Observable<ArticleModel | null> {
    if (environment.useBackend) {
      return this.http.get<any>(`${this.apiUrl}/articles/${id}`)
        .pipe(map(res => this.mapArticleFromBackend(res)))
    } else {
      const article = this.loadAllArticles().find(a => a.id === id) || null;
      return of(article);
    }
  }

  getCommentsByPostId(postId: string): Observable<CommentModel[]> {
    if (environment.useBackend) {
      return this.http.get<any[]>(`${this.apiUrl}/comments/article/${postId}`).pipe(
        map(comments => comments.map(c => this.mapCommentFromBackend(c)))
      );
    } else {
      const comments = this.loadAllComments().filter(c => c.postId === postId);
      return of(comments);
    }
  }

  addComment(comment: CommentModel): Observable<CommentModel[]> {
    if (environment.useBackend) {
      const payload = {
        username: comment.author,
        content: comment.content,
        articleId: comment.postId,
      };
      return this.http.post<any>(`${this.apiUrl}/comments`, payload).pipe(
        switchMap(() => this.getCommentsByPostId(comment.postId))
      );
    } else {
      const allComments = this.loadAllComments();
      const updated = [...allComments, comment];
      this.saveAllComments(updated);
      return of(updated);
    }
  }

  updateCommentRating(commentId: string, newRating: number): Observable<CommentModel> {
    if (environment.useBackend) {
      return this.http.patch<CommentModel>(`${this.apiUrl}/comments/${commentId}/rating`, { rating: newRating })
        .pipe(map(c => this.mapCommentFromBackend(c)));
    } else {
      const comments = this.loadAllComments();
      const index = comments.findIndex(c => c.id === commentId);
      if (index !== -1) {
        comments[index] = { ...comments[index], rating: newRating };
        this.saveAllComments(comments);
        return of(comments[index]);
      }
      return throwError(() => new Error('Comment not found'));
    }
  }

  updatePostRating(postId: string, newRating: number): Observable<ArticleModel[]> {
    if (environment.useBackend) {
      const delta = newRating - (this.currentPostRating?.[postId] ?? 0);
      const endpoint = delta > 0 ? 'rating-up' : 'rating-down';
      return this.http.patch(`${this.apiUrl}/articles/${postId}/${endpoint}`, {}).pipe(
        switchMap(() => this.getArticlesList())
      );
    } else {
      const allArticles = this.loadAllArticles();
      const updatedArticles = allArticles.map((article) =>
        article.id === postId ? { ...article, rating: newRating } : article,
      );
      this.saveAllArticles(updatedArticles);
      return of(updatedArticles);
    }
  }
  private mapArticleFromBackend(backend: any): ArticleModel {
    return {
      id: backend.id,
      heading: backend.title,
      content: backend.content,
      dateTime: backend.createdAt,
      img: backend.imgSrc || 'assets/img/begin.jpeg',
      rating: backend.rating ?? 0,
    };
  }

  private mapCommentFromBackend(backend: any): CommentModel {
    return {
      id: backend.id,
      postId: backend.articleId,
      author: backend.username,
      content: backend.content,
      dateTime: backend.createdAt,
      rating: backend.rating ?? 0,
    };
  }

  private getArticlesList(): Observable<ArticleModel[]> {

    return this.http.get<{ items: any[] }>(`${this.apiUrl}/articles?limit=9999`).pipe(
      map(res => (res.items || []).map(a => this.mapArticleFromBackend(a)))
    );
  }

  private currentPostRating: { [id: string]: number } = {};

}
