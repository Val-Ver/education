import { Component, Input, Output, HostBinding, EventEmitter } from '@angular/core';
import {ArticleModel} from '../../../models/article.model'


@Component({
  selector: 'app-article-card',
  // imports: [],
  templateUrl: './article-card.html',
  styleUrl: './article-card.scss',
  standalone: true,
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
  @Output() edit = new EventEmitter<string>();  // добавить

  onEdit(): void {
    this.edit.emit(this.article.id);
  }
  onDelete(): void {
    this.delete.emit(this.article.id);
  }
}
