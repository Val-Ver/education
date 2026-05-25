import { Component, EventEmitter, Output, inject, DestroyRef, computed } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommentModel } from '../../../models/comment.model';
import { ActivatedRoute } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthStore } from '../../../services/auth/auth.store';

@Component({
  selector: 'app-comment-form',
  imports: [ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './comment-form.html',
  styleUrl: './comment-form.scss',
  standalone: true,
})
export class CommentForm {
  @Output() commentAdded = new EventEmitter<Omit<CommentModel, 'id' | 'dateTime' | 'rating'>>();

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  //private destroyRef = inject(DestroyRef);
  private authStore = inject(AuthStore);

  commentForm: FormGroup;
  isLoggedIn = computed(() => this.authStore.user() !== null);
  currentUsername = computed(() => this.authStore.user()?.username || '');

  constructor() {
    this.commentForm = this.fb.group({
      author: ['', Validators.required],
      content: ['', Validators.required],
    });
    if (this.isLoggedIn()) {
      this.commentForm.patchValue({ author: this.currentUsername() });
      this.commentForm.get('author')?.disable();
    }
  }

  onSubmit(): void {
    if (this.commentForm.invalid) return;
    const postId = this.route.snapshot.paramMap.get('id');
    if (!postId) return;

    let author = this.commentForm.value.author;
    if (this.isLoggedIn()) {
      author = this.currentUsername();
    }

    const newComment = {
      postId: postId,
      author: this.commentForm.value.author,
      content: this.commentForm.value.content,
    };
    this.commentAdded.emit(newComment);
    this.commentForm.reset();
    if (this.isLoggedIn()) {
      this.commentForm.patchValue({ author: this.currentUsername() });
      this.commentForm.get('author')?.disable();
    }
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
