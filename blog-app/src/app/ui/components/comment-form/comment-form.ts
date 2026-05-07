import { Component, EventEmitter, Output, inject, DestroyRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommentModel } from '../../../models/comment.model';
import { ActivatedRoute } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-comment-form',
  imports: [ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './comment-form.html',
  styleUrl: './comment-form.scss',
})
export class CommentForm {
  @Output() commentAdded = new EventEmitter<CommentModel>();

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  commentForm: FormGroup;

  constructor() {
    this.commentForm = this.fb.group({
      author: ['', Validators.required],
      content: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.commentForm.invalid) return;
    const postId = this.route.snapshot.paramMap.get('id');
    if (!postId) return;

    const newComment: CommentModel = {
      id: Date.now().toString(),
      postId: postId,
      author: this.commentForm.value.author,
      content: this.commentForm.value.content,
      dateTime: this.formatDateTime(new Date()),
      rating: 0,
    };
    this.commentAdded.emit(newComment);
    this.commentForm.reset();
  }

  private formatDateTime(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}.${month}.${year} ${hours}:${minutes}`;
  }

  get author() {
    return this.commentForm.get('author');
  }
  get content() {
    return this.commentForm.get('content');
  }
}
