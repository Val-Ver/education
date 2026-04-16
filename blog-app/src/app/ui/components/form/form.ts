import { Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import {ArticlesService} from '../../../services/articles.service';
import {ArticleModel} from '../../../models/article.model';
import {FormsModule} from '@angular/forms';


@Component({
  selector: 'app-form',
  // imports: [],
  templateUrl: './form.html',
  styleUrl: './form.scss',
  standalone: true,
  imports: [FormsModule],
})
export class Form {
  @Input() visible = false;
  @Output() close = new EventEmitter();
  @Input() articleToEdit?: ArticleModel | null = null;

  heading = '';
  content = '';

  private articlesService = inject(ArticlesService);

  onSubmit(): void {
    if (!this.heading.trim() || !this.content.trim()) return;

    if (this.articleToEdit) {
      const updatedArticle: ArticleModel = {
        ...this.articleToEdit,
        heading: this.heading,
        content: this.content,
      };
      this.articlesService.updateArticle(updatedArticle);
    } else {
      const newArticle: ArticleModel = {
        id: Date.now().toString(),
        heading: this.heading,
        content: this.content,
        dateTime: this.formatDateTime(new Date()),
        img: 'assets/img/begin.jpeg',
      };
      this.articlesService.addArticle(newArticle);
    }
    this.onCancel();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['articleToEdit'] && this.articleToEdit) {
      this.heading = this.articleToEdit.heading;
      this.content = this.articleToEdit.content;
    } else if (changes['visible'] && this.visible && !this.articleToEdit) {
      this.heading = '';
      this.content = '';
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

  onCancel() {
    this.heading = '';
    this.content = '';
    this.close.emit();
  }
}
