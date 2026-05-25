import { Component, Input, Output, HostBinding, EventEmitter, inject } from '@angular/core';
import { ArticleModel } from '../../../models/article.model'
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthStore } from '../../../services/auth/auth.store';
import { HasRoleDirective } from '../../../directives/has-role.directive';

@Component({
  selector: 'app-article-card',
  templateUrl: './article-card.html',
  styleUrl: './article-card.scss',
  standalone: true,
  imports: [RouterLink, MatIconModule, MatButtonModule, HasRoleDirective],
})
export class ArticleCard {
  @Input() layout: 'blog' | 'preview' = 'blog';
  @HostBinding('class') get hostClass() {
    return `layout-${this.layout}`;
  }
  @Input({ required: true }) article!: ArticleModel;
  @Input() showDelete = false;
  @Input() isFeatured = false;

  @Output() delete = new EventEmitter<string>();
  @Output() edit = new EventEmitter<string>(); // добавить
  authStore = inject(AuthStore);

  onEdit(): void {
    this.edit.emit(this.article.id);
  }
  onDelete(): void {
    this.delete.emit(this.article.id);
  }
}
