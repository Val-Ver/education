import { gql } from '@apollo/client/core';

export const GET_COMMENTS = gql`
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
