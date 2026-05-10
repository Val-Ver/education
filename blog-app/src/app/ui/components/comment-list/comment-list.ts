import { Component, Input } from '@angular/core';
import { CommentModel } from '../../../models/comment.model';
import { CommentItem } from '../comment-item/comment-item';

@Component({
  selector: 'app-comment-list',
  imports: [CommentItem],
  templateUrl: './comment-list.html',
  styleUrl: './comment-list.scss',
  standalone: true,
})
export class CommentList {
  @Input({ required: true }) comments!: CommentModel[];
}
