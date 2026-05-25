import { gql } from '@apollo/client/core';

export const ARTICLE_RATING_UP = gql`
  mutation ArticleRatingUp($id: ID!) {
    articleRatingUp(id: $id) {
      rating
    }
  }
`;
