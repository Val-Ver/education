import { Injectable, inject } from '@angular/core';
import { Observable, map, switchMap, of } from 'rxjs';
import { IPostService } from './post-service.interface';
import { GraphQLPostService } from './graphql-post.service';
import { ArticleModel } from '../../models/article.model';
import { CommentModel } from '../../models/comment.model';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class GraphQLPostAdapterService implements IPostService {
  private graphQLService = inject(GraphQLPostService);
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  getPostById(id: string): Observable<ArticleModel | null> {
    return this.graphQLService
      .getPostById(id)
      .pipe(map((article) => this.mapToArticleModel(article)));
  }

  getCommentsByPostId(postId: string): Observable<CommentModel[]> {
    return this.graphQLService
      .getCommentsByPostId(postId)
      .pipe(map((comments) => comments.map((c) => this.mapToCommentModel(c))));
  }

  addComment(comment: Omit<CommentModel, 'id' | 'dateTime' | 'rating'>): Observable<CommentModel> {
    const payload = {
      username: comment.author,
      content: comment.content,
      articleId: comment.postId,
    };
    return this.http.post<CommentModel>(`${this.apiUrl}/comments`, payload);
  }

  updatePostRating(postId: string, newRating: number): Observable<ArticleModel[]> {
    return this.getPostById(postId).pipe(
      switchMap((article) => {
        if (!article) throw new Error('Article not found');
        const delta = newRating - article.rating;
        return this.graphQLService.updatePostRating(postId, delta);
      }),
      switchMap(() => this.getAllArticles()), // нужно получить все статьи для обновления стора
    );
  }

  updateCommentRating(commentId: string, newRating: number): Observable<CommentModel> {
    return this.graphQLService.updateCommentRating(commentId, newRating).pipe(
      map((result) => ({ ...result, id: commentId }) as CommentModel), // преобразуем в CommentModel
    );
  }

  private mapToArticleModel(gqlArticle: any): ArticleModel {
    return {
      id: gqlArticle.id,
      heading: gqlArticle.title,
      content: gqlArticle.content,
      dateTime: gqlArticle.createdAt,
      img: gqlArticle.imgSrc || 'assets/img/begin.jpeg',
      rating: gqlArticle.rating,
      categoryId: gqlArticle.categoryId,
      categoryName: gqlArticle.category?.name,
    };
  }

  private mapToCommentModel(gqlComment: any): CommentModel {
    return {
      id: gqlComment.id,
      postId: gqlComment.articleId,
      author: gqlComment.username,
      content: gqlComment.content,
      dateTime: gqlComment.createdAt,
      rating: gqlComment.rating,
    };
  }

  private getAllArticles(): Observable<ArticleModel[]> {
    return this.graphQLService
      .getAllArticles(9999)
      .pipe(map((articles) => articles.map((a) => this.mapToArticleModel(a))));
  }
}
