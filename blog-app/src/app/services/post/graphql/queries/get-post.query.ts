import { ARTICLE_FIELDS } from '../fragments/article-fields.fragment';
import { gql } from '@apollo/client/core';

export const GET_POST = gql`
  ${ARTICLE_FIELDS}
  query GetPost($id: ID!) {
    article(id: $id) {
      ...ArticleFields
    }
  }
`;
