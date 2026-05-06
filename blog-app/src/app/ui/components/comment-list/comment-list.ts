import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommentModel } from '../../../models/comment.model';
import { CommentItem } from '../comment-item/comment-item';

@Component({
  selector: 'app-comment-list',
  imports: [CommentItem],
  templateUrl: './comment-list.html',
  styleUrl: './comment-list.scss',
})
export class CommentList {
  @Input({ required: true }) comments!: CommentModel[];
  @Output() ratingChanged = new EventEmitter<{ commentId: string; newRating: number }>();

  onRatingChanged(event: { commentId: string; newRating: number }): void {
    this.ratingChanged.emit(event);
  }
}
