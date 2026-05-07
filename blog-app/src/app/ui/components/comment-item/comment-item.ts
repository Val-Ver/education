import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommentModel } from '../../../models/comment.model';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'app-comment-item',
  imports: [MatCardModule, MatIconModule, MatIconButton],
  templateUrl: './comment-item.html',
  styleUrl: './comment-item.scss',
})
export class CommentItem {
  @Input({ required: true }) comment!: CommentModel;
  @Output() ratingChanged = new EventEmitter<{ commentId: string; newRating: number }>();

  changeRating(delta: number): void {
    const newRating = this.comment.rating + delta;
    if (newRating < 0) return;
    this.ratingChanged.emit({ commentId: this.comment.id, newRating });
  }
}
