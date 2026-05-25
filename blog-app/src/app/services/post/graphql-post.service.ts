import { Injectable, inject } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, map } from 'rxjs';
import { gql } from '@apollo/client/core';
import { GraphQLArticle, GraphQLComment } from '../../models/graphql-types';

@Injectable({
  providedIn: 'root',
})
export class GraphQLPostService {
  private apollo = inject(Apollo);

  getPostById(id: string): Observable<GraphQLArticle | null> {
    const GET_POST = gql`
      query GetPost($id: ID!) {
        article(id: $id) {
          id
          title
          content
          createdAt
          imgSrc
          rating
          categoryId
          category {
            id
            name
          }
        }
      }
    `;
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
    const GET_COMMENTS = gql`
      query GetComments($articleId: ID!) {
        commentsByArticle(articleId: $articleId) {
          id
          articleId
          username
          content
          createdAt
          rating
        }
      }
    `;
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
    const mutation = delta > 0
      ? gql`mutation Up($id: ID!) { articleRatingUp(id: $id) { rating } }`
      : gql`mutation Down($id: ID!) { articleRatingDown(id: $id) { rating } }`;
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
    const mutation = delta > 0
      ? gql`mutation Up($id: ID!) { commentRatingUp(id: $id) { rating }}`
      : gql` mutation Down($id: ID!) { commentRatingDown(id: $id) { rating }}`;
    return this.apollo
      .mutate<{ commentRatingUp: { rating: number } }>({
        mutation,
        variables: { commentId },
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
