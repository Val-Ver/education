import { gql } from '@apollo/client/core';

export const COMMENT_RATING_DOWN = gql`
  mutation CommentRatingDown($id: ID!) {
    commentRatingDown(id: $id) {
      rating
    }
  }
`;
