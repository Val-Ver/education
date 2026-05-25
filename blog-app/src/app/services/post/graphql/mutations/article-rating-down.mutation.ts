import { gql } from '@apollo/client/core';

export const ARTICLE_RATING_DOWN = gql`
  mutation ArticleRatingDown($id: ID!) {
    articleRatingDown(id: $id) {
      rating
    }
  }
`;
