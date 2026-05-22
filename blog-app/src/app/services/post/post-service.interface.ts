import { Observable } from 'rxjs';
import { ArticleModel } from '../../models/article.model';
import { CommentModel } from '../../models/comment.model';

export interface IPostService {
  getPostById(id: string): Observable<ArticleModel | null>;
  getCommentsByPostId(postId: string): Observable<CommentModel[]>;
  updatePostRating(postId: string, newRating: number): Observable<ArticleModel[]>;
  updateCommentRating(commentId: string, newRating: number): Observable<CommentModel>;
  addComment(comment: Omit<CommentModel, 'id' | 'dateTime' | 'rating'>): Observable<CommentModel>;
}
