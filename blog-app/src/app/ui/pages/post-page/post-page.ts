import { Component, inject, OnInit, DestroyRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { CommentForm } from '../../components/comment-form/comment-form';
import { CommentList } from '../../components/comment-list/comment-list';

import { PostStoreService } from '../../../services/post/post-store.service';
import { PostDataService } from '../../../services/post/post-data.service';
import { CommentModel } from '../../../models/comment.model';

import { Title } from '@angular/platform-browser';

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

  post = this.postStore.post;
  comments = this.postStore.comments;

  isRatingUpdating = false;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/']);
      return;
    }

    this.postData
      .getPostById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((post) => {
        if (post) {
          this.postStore.setPost(post);
          this.titleService.setTitle(post.heading);
        } else {
          this.router.navigate(['/blog']);
        }
      });

    this.postData
      .getCommentsByPostId(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((comments) => {
        this.postStore.setComments(comments);
      });
  }

  changeRating(delta: number): void {
    const currentPost = this.post();
    if (!currentPost) return;
    const newRating = currentPost.rating + delta;
    if (newRating < 0) return;
    this.isRatingUpdating = true;
    this.postData
      .updatePostRating(currentPost.id, newRating)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((updatedArticles) => {
        const updatedPost = updatedArticles.find((a) => a.id === currentPost.id);
        if (updatedPost) {
          this.postStore.updatePostRating(newRating);
          this.postStore.post.set(updatedPost);
        }
        this.isRatingUpdating = false;
      });
  }

  onCommentAdded(comment: CommentModel): void {
    this.postData
      .addComment(comment)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const postId = this.post()!.id;
        this.postData.getCommentsByPostId(postId).subscribe((comments) => {
          this.postStore.setComments(comments);
        });
      });
  }
}
