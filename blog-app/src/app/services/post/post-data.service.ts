import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ArticleModel } from '../../models/article.model';
import { CommentModel } from '../../models/comment.model';
import { ArticlesDataService } from '../articles/articles-data.service';

@Injectable({
  providedIn: 'root',
})
export class PostDataService {
  private readonly COMMENTS_STORAGE_KEY = 'blog_comments';

  constructor(private articlesDataService: ArticlesDataService) {}

  getPostById(id: string): Observable<ArticleModel | null> {
    const allArticles = this.loadAllArticles();
    const post = allArticles.find((a) => a.id === id) || null;
    if (post && post.rating === undefined) {
      post.rating = 0;
      this.updateArticleInStorage(post);
    }
    return of(post);
  }

  getCommentsByPostId(postId: string): Observable<CommentModel[]> {
    const allComments = this.loadAllComments();
    const commentsForPost = allComments.filter((c) => c.postId === postId);
    return of(commentsForPost);
  }

  addComment(comment: CommentModel): Observable<CommentModel[]> {
    const allComments = this.loadAllComments();
    const updated = [...allComments, comment];
    this.saveAllComments(updated);
    return of(updated);
  }

  updateCommentRating(commentId: string, newRating: number): Observable<CommentModel[]> {
    const allComments = this.loadAllComments();
    const updated = allComments.map((c) => (c.id === commentId ? { ...c, rating: newRating } : c));
    this.saveAllComments(updated);
    return of(updated);
  }

  updatePostRating(postId: string, newRating: number): Observable<ArticleModel[]> {
    const allArticles = this.loadAllArticles();
    const updatedArticles = allArticles.map((article) =>
      article.id === postId ? { ...article, rating: newRating } : article,
    );
    this.saveAllArticles(updatedArticles);
    return of(updatedArticles);
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

  private loadAllComments(): CommentModel[] {
    const raw = localStorage.getItem(this.COMMENTS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  }
// переделать на хранилище
  private saveAllComments(comments: CommentModel[]): void {
    localStorage.setItem(this.COMMENTS_STORAGE_KEY, JSON.stringify(comments));
  }
}
