import { Component, Input, Output, EventEmitter } from '@angular/core';
import {ArticleModel} from '../../../models/article.model'
// import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-article-card',
  // imports: [CommonModule],
  templateUrl: './article-card.html',
  styleUrl: './article-card.scss',
})
export class ArticleCard {
  @Input({ required: true }) article!: ArticleModel;
  @Input() showDelete = false;
  @Input() isFeatured = false;
  @Output() delete = new EventEmitter<string>();

  onDelete(): void {
    this.delete.emit(this.article.id);
  }
}
