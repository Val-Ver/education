import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ArticleModel } from '../../models/article.model';
import { CommentModel } from '../../models/comment.model';
import { IPostService } from './post-service.interface';
import { INITIAL_ARTICLES } from '../../data/initial-articles';
import { INITIAL_COMMENTS } from '../../data/initial-comments';

@Injectable()
export class LocalStoragePostService {
  private readonly ARTICLES_KEY = 'articles';
  private readonly COMMENTS_KEY = 'blog_comments';

  constructor() {
    this.initStorage();
  }

  private initStorage(): void {
    if (!localStorage.getItem(this.ARTICLES_KEY)) {
      localStorage.setItem(this.ARTICLES_KEY, JSON.stringify(INITIAL_ARTICLES));
    }
    if (!localStorage.getItem(this.COMMENTS_KEY)) {
      localStorage.setItem(this.COMMENTS_KEY, JSON.stringify(INITIAL_COMMENTS));
    }
  }

  private getArticles(): ArticleModel[] {
    return JSON.parse(localStorage.getItem(this.ARTICLES_KEY) || '[]');
  }

  private saveArticles(articles: ArticleModel[]): void {
    localStorage.setItem(this.ARTICLES_KEY, JSON.stringify(articles));
  }

  private getComments(): CommentModel[] {
    return JSON.parse(localStorage.getItem(this.COMMENTS_KEY) || '[]');
  }

  private saveComments(comments: CommentModel[]): void {
    localStorage.setItem(this.COMMENTS_KEY, JSON.stringify(comments));
  }

  getPostById(id: string): Observable<ArticleModel | null> {
    const article = this.getArticles().find((a) => a.id === id) || null;
    return of(article);
  }

  getCommentsByPostId(postId: string): Observable<CommentModel[]> {
    const comments = this.getComments().filter((c) => c.postId === postId);
    return of(comments);
  }

  updatePostRating(postId: string, newRating: number): Observable<ArticleModel[]> {
    const articles = this.getArticles();
    const updated = articles.map((article) =>
      article.id === postId ? { ...article, rating: newRating } : article,
    );
    this.saveArticles(updated);
    return of(updated);
  }

  addComment(comment: Omit<CommentModel, 'id' | 'dateTime' | 'rating'>): Observable<CommentModel> {
    const newComment: CommentModel = {
      id: Date.now().toString(),
      postId: comment.postId,
      author: comment.author,
      content: comment.content,
      dateTime: new Date().toLocaleString(),
      rating: 0,
    };
    const comments = this.getComments();
    this.saveComments([...comments, newComment]);
    return of(newComment);
  }

  updateCommentRating(commentId: string, newRating: number): Observable<CommentModel> {
    const comments = this.getComments();
    const index = comments.findIndex((c) => c.id === commentId);
    if (index !== -1) {
      comments[index] = { ...comments[index], rating: newRating };
      this.saveComments(comments);
      return of(comments[index]);
    }
    throw new Error('Comment not found');
  }
}
