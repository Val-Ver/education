import { Injectable, inject } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, map } from 'rxjs';
import { gql } from '@apollo/client/core';
import { GraphQLArticle, GraphQLComment } from '../../models/graphql-types';

import { GET_POST } from './graphql/queries/get-post.query';
import { GET_COMMENTS } from './graphql/queries/get-comments.query';
import { ARTICLE_RATING_UP } from './graphql/mutations/article-rating-up.mutation';
import { ARTICLE_RATING_DOWN } from './graphql/mutations/article-rating-down.mutation';
import { COMMENT_RATING_UP } from './graphql/mutations/comment-rating-up.mutation';
import { COMMENT_RATING_DOWN } from './graphql/mutations/comment-rating-down.mutation';


@Injectable({
  providedIn: 'root',
})
export class GraphQLPostService {
  private apollo = inject(Apollo);

  getPostById(id: string): Observable<GraphQLArticle | null> {
    return this.apollo
      .query<{ article: GraphQLArticle }>({
        query: GET_POST,
        variables: { id },
      })
      .pipe(
        map((result) => {
          if (!result.data) {
            throw new Error('No data returned from query');
          }
          return result.data.article;
        }),
      );
  }

  getCommentsByPostId(postId: string): Observable<GraphQLComment[]> {
    return this.apollo
      .query<{ commentsByArticle: GraphQLComment[] }>({
        query: GET_COMMENTS,
        variables: { articleId: postId },
      })
      .pipe(
        map((result) => {
          if (!result.data) {
            throw new Error('No data returned from query');
          }
          return result.data.commentsByArticle;
        }),
      );
  }

  updatePostRating(id: string, delta: number): Observable<{ rating: number }> {
    const mutation = delta > 0 ? ARTICLE_RATING_UP : ARTICLE_RATING_DOWN;
    return this.apollo
      .mutate<{ articleRatingUp: { rating: number } }>({
        mutation,
        variables: { id },
      })
      .pipe(
        map((result) => {
          if (!result.data) {
            throw new Error('No data returned from mutation');
          }
          return result.data.articleRatingUp;
        }),
      );
  }

  updateCommentRating(commentId: string, delta: number): Observable<{ rating: number }> {
    const mutation = delta > 0 ? COMMENT_RATING_UP : COMMENT_RATING_DOWN;
    return this.apollo
      .mutate<{ commentRatingUp: { rating: number } }>({
        mutation,
        variables: { id: commentId },
      })
      .pipe(
        map((result) => {
          if (!result.data) {
            throw new Error('No data returned from mutation');
          }
          return result.data.commentRatingUp;
        }),
      );
  }
}
