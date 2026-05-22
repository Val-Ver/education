export interface GraphQLArticle {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  imgSrc: string;
  rating: number;
  categoryId?: string;
  category?: { id: string; name: string };
}

export interface GraphQLComment {
  id: string;
  articleId: string;
  username: string;
  content: string;
  createdAt: string;
  rating: number;
}
