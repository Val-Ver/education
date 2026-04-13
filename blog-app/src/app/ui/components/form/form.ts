import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
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

  heading = '';
  content = '';

  private articlesService = inject(ArticlesService);

  onSubmit(): void {
    if (!this.heading.trim() || !this.content.trim()) return;

    const newArticle: ArticleModel = {
      id: Date.now().toString(),
      heading: this.heading,
      content: this.content,
      dateTime: this.formatDateTime(new Date()),
      img: 'assets/img/begin.jpeg',
    };

    this.articlesService.addArticle(newArticle);
    this.onCancel();
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
    this.close.emit();
  }
}
