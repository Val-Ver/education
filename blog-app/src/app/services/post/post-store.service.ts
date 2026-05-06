import { Injectable, signal, WritableSignal } from '@angular/core';
import { ArticleModel } from '../../models/article.model';
import { CommentModel } from '../../models/comment.model';

@Injectable({
  providedIn: 'root',
})

export class PostStoreService {
  public post: WritableSignal<ArticleModel | null> = signal<ArticleModel | null>(null);
  public comments: WritableSignal<CommentModel[]> = signal<CommentModel[]>([]);

  setPost(post: ArticleModel): void {
    this.post.set(post);
  }

  setComments(comments: CommentModel[]): void {
    this.comments.set(comments);
  }

  addComment(comment: CommentModel): void {
    this.comments.update(commentsList => [...commentsList, comment]);
  }

  updateCommentRating(commentId: string, newRating: number): void {
    this.comments.update((commentsList) =>
      commentsList.map((comment) =>
        comment.id === commentId ? { ...comment, rating: newRating } : comment,
      ),
    );
  }

  updatePostRating(newRating: number): void {
    const currentPost = this.post();
    if (currentPost) {
      const updatedPost = { ...currentPost, rating: newRating };
      this.post.set(updatedPost);
    }
  }
}
