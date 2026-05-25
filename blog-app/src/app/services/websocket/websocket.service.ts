import { Injectable, inject, signal, DestroyRef } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { Subject } from 'rxjs';
import {
  ArticleRatingPayload,
  CommentRatingPayload,
  CommentCreatedPayload,
} from './websocket.types';

/*export interface ArticleRatingEvent {
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
}*/

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket: Socket | null = null;
  private isConnected = false;
  private connectPromise: Promise<void> | null = null;

  public articleRating$ = new Subject<ArticleRatingPayload>();
  public commentRating$ = new Subject<CommentRatingPayload>();
  public newComment$ = new Subject<CommentCreatedPayload>();

  /*public articleRating$ = new Subject<{
    articleId: string;
    rating: number;
    prevRating: number;
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
  }>();*/

  connect() {
    if (this.socket && this.isConnected) {
      return Promise.resolve();
    }
    if (this.connectPromise) {
      return this.connectPromise;
    }

    this.connectPromise = new Promise((resolve) => {
      if (!environment.useBackend) {
        resolve();
        return;
      }
      this.socket = io('http://localhost:3000/events', { transports: ['websocket'] });

      this.socket.on('connect', () => {
        this.isConnected = true;
        resolve();
      });

      this.socket.on('article-rating-changed', (data) => {
        this.articleRating$.next(data.payload);
      });
      this.socket.on('comment-rating-changed', (data) => {
        this.commentRating$.next(data.payload);
      });
      this.socket.on('comment-created', (data) => {
        this.newComment$.next(data.payload);
      });

      this.socket.on('disconnect', () => {
        this.isConnected = false;
      });
    });
    return this.connectPromise;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.connectPromise = null;
    }
  }
  async subscribeToArticle(articleId: string) {
    await this.connect();
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
