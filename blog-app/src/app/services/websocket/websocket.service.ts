import { Injectable, inject, signal, DestroyRef } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { Subject } from 'rxjs';

export interface ArticleRatingEvent {
  type: 'ARTICLE_RATING_CHANGED';
  payload: { articleId: string; rating: number; prevRating: number };
}
export interface CommentRatingEvent {
  type: 'COMMENT_RATING_CHANGED';
  payload: { commentId: string; articleId: string; rating: number; prevRating: number };
}
export interface CommentCreatedEvent {
  type: 'COMMENT_CREATED';
  payload: {
    commentId: string;
    articleId: string;
    content: string;
    username: string;
    createdAt: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket: Socket | null = null;
  private isConnected = false;

  public articleRating$ = new Subject<{
    articleId: string;
    rating: number;
    prevRating: number
  }>();
  public commentRating$ = new Subject<{
    commentId: string;
    articleId: string;
    rating: number;
    prevRating: number;
  }>();
  public newComment$ = new Subject<{
    commentId: string;
    articleId: string;
    content: string;
    username: string;
    createdAt: string;
  }>();
  connect() {
    if (!environment.useBackend) return;
    this.socket = io('http://localhost:3000/events', { transports: ['websocket'] });
    this.socket.on('article-rating-changed', (data) => this.articleRating$.next(data));
    this.socket.on('comment-rating-changed', (data) => this.commentRating$.next(data));
    this.socket.on('comment-created', (data) => this.newComment$.next(data));
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
  subscribeToArticle(articleId: string) {
    if (!this.isConnected) return;
    this.socket?.emit('subscribe-article', articleId);
  }

  unsubscribeFromArticle(articleId: string) {
    if (!this.isConnected) return;
    this.socket?.emit('unsubscribe-article', articleId);
  }

  subscribeToAll() {
    if (!this.isConnected) return;
    this.socket?.emit('subscribe-all');
  }
}
