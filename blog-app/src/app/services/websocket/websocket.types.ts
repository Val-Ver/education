export interface ArticleRatingPayload {
  articleId: string;
  rating: number;
  prevRating: number;
}

export interface CommentRatingPayload {
  commentId: string;
  articleId: string;
  rating: number;
  prevRating: number;
}

export interface CommentCreatedPayload {
  commentId: string;
  articleId: string;
  content: string;
  username: string;
  createdAt: string;
}

export interface ArticleRatingEvent {
  type: 'ARTICLE_RATING_CHANGED';
  payload: ArticleRatingPayload;
}

export interface CommentRatingEvent {
  type: 'COMMENT_RATING_CHANGED';
  payload: CommentRatingPayload;
}

export interface CommentCreatedEvent {
  type: 'COMMENT_CREATED';
  payload: CommentCreatedPayload;
}

export type WebSocketEvent = ArticleRatingEvent | CommentRatingEvent | CommentCreatedEvent;
