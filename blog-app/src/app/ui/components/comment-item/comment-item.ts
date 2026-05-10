import { Component, inject, DestroyRef, input } from '@angular/core';
import { CommentModel } from '../../../models/comment.model';

import { PostDataService } from '../../../services/post/post-data.service';
import { PostStoreService } from '../../../services/post/post-store.service';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'app-comment-item',
  imports: [MatCardModule, MatIconModule, MatIconButton],
  templateUrl: './comment-item.html',
  styleUrl: './comment-item.scss',
  standalone: true,
})
export class CommentItem {
  comment = input.required<CommentModel>();

  private postData = inject(PostDataService);
  private postStore = inject(PostStoreService);
  private destroyRef = inject(DestroyRef);

  changeRating(delta: number): void {
    const currentComment = this.comment();
    const newRating = currentComment.rating + delta;
    if (newRating < 0) return;

    this.postData.updateCommentRating(currentComment.id, newRating).subscribe(() => {
      this.postStore.updateCommentRating(currentComment.id, newRating);
    });
  }
}
