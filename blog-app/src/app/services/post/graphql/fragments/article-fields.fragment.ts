import { gql } from '@apollo/client/core';

export const ARTICLE_FIELDS = gql`
  fragment ArticleFields on ArticleEntity {
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
`;
