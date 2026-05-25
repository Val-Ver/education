import { gql } from '@apollo/client/core';

export const COMMENT_RATING_UP = gql`
  mutation CommentRatingUp($id: ID!) {
    commentRatingUp(id: $id) {
      rating
    }
  }
`;
