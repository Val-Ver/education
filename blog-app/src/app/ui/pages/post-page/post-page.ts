import { Component, inject, OnInit, DestroyRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { CommentForm } from '../../components/comment-form/comment-form';
import { CommentList } from '../../components/comment-list/comment-list';

import { PostStoreService } from '../../../services/post/post-store.service';
import { PostDataService } from '../../../services/post/post-data.service';
import { CommentModel } from '../../../models/comment.model';

import { Title } from '@angular/platform-browser';

import { POST_SERVICE } from '../../../services/post/post-service.token';
import { IPostService } from '../../../services/post/post-service.interface';
import { WebSocketService } from '../../../services/websocket/websocket.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-post-page',
  imports: [CommentForm, CommentList],
  templateUrl: './post-page.html',
  styleUrl: './post-page.scss',
  standalone: true,
  providers: [PostStoreService],
})
export class PostPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private postStore = inject(PostStoreService);
  private postData = inject(PostDataService);
  private destroyRef = inject(DestroyRef);
  private titleService = inject(Title);
  private postService = inject(POST_SERVICE);
  private webSocketService = inject(WebSocketService);
  private cdr = inject(ChangeDetectorRef);

  post = this.postStore.post;
  comments = this.postStore.comments;

  isRatingUpdating = false;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/']);
      return;
    }

    this.postService
      .getPostById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((post) => {
        if (post) {
          this.postStore.setPost(post);
          this.titleService.setTitle(post.heading);
          this.cdr.detectChanges();
        } else {
          this.router.navigate(['/blog']);
        }
      });

    this.postService
      .getCommentsByPostId(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((comments) => {
        this.postStore.setComments(comments);
      });

    this.webSocketService.connect();
    this.webSocketService.subscribeToArticle(id);

    this.webSocketService.articleRating$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((update) => {
        if (update && update.articleId === id) {
          this.postStore.updatePostRating(update.rating);
        }
      });

    this.webSocketService.commentRating$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((update) => {
        if (update && update.articleId === id) {
          this.postStore.updateCommentRating(update.commentId, update.rating);
        }
      });

    this.webSocketService.newComment$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((payload) => {
        if (payload && payload.articleId === id) {
          const newComment: CommentModel = {
            id: payload.commentId,
            postId: payload.articleId,
            author: payload.username,
            content: payload.content,
            dateTime: payload.createdAt,
            rating: 0,
          };
          this.postStore.addComment(newComment);
        }
      });
  }

  changeRating(delta: number): void {
    const currentPost = this.post();
    if (!currentPost) return;
    const newRating = currentPost.rating + delta;
    if (newRating < 0) return;
    this.isRatingUpdating = true;
    this.postService
      .updatePostRating(currentPost.id, newRating)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.postStore.updatePostRating(newRating);
          this.isRatingUpdating = false;
        },
        error: () => (this.isRatingUpdating = false),
      });
  }

  onCommentAdded(comment: Omit<CommentModel, 'id' | 'dateTime' | 'rating'>): void {
    this.postService
      .addComment(comment)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (createdComment) => {
          this.postStore.addComment(createdComment);
        },
        error: (err) => console.error('Ошибка добавления комментария', err),

      });
  }
  ngOnDestroy(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.webSocketService.unsubscribeFromArticle(id);
    this.webSocketService.disconnect();
  }
}
