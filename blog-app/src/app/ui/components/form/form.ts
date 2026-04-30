import { Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import {ArticlesService} from '../../../services/articles.service';
import {ArticleModel} from '../../../models/article.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

interface MinLengthValidationInfo {
  requiredLength: number;
  actualLength: number;
}

@Component({
  selector: 'app-form',
  imports: [ReactiveFormsModule],
  templateUrl: './form.html',
  styleUrl: './form.scss',
  standalone: true,
})
export class Form {
  @Input() visible = false;
  @Output() close = new EventEmitter();
  @Input() articleToEdit?: ArticleModel | null = null;

  articleForm: FormGroup;
  private articlesService = inject(ArticlesService);
  private fb = inject(FormBuilder);

  constructor() {
    this.articleForm = this.fb.group({
      heading: ['', [Validators.required, Validators.minLength(25)]],
      content: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.articleForm.invalid) return;
    const { heading, content } = this.articleForm.value;

    if (this.articleToEdit) {
      const updatedArticle: ArticleModel = {
        ...this.articleToEdit,
        heading: heading,
        content: content,
      };
      this.articlesService.updateArticle(updatedArticle);
    } else {
      const newArticle: ArticleModel = {
        id: Date.now().toString(),
        heading: heading,
        content: content,
        dateTime: this.formatDateTime(new Date()),
        img: 'assets/img/begin.jpeg',
      };
      this.articlesService.addArticle(newArticle);
    }
    this.onCancel();
  }

  ngOnChanges(changes: SimpleChanges): void {
   if (changes['articleToEdit'] || changes['visible']) {
      if (this.visible && this.articleToEdit) {
        this.articleForm.patchValue({
          heading: this.articleToEdit.heading,
          content: this.articleToEdit.content,
        });
      } else if (this.visible && !this.articleToEdit) {
        this.articleForm.reset();
      }
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
    this.articleForm.reset();
    this.close.emit();
  }

  get heading() {
    return this.articleForm.get('heading');
  }
  get content() {
    return this.articleForm.get('content');
  }

  protected hasError(controlName: string): boolean {
    const control = this.articleForm.get(controlName);
    return !!(control?.invalid && control?.touched);
  }

  protected getControlErrors(controlName: string): string[] {
    const control = this.articleForm.get(controlName);
    const errors = control?.errors ?? null;
    if (!errors) return [];

    const errorTexts: string[] = [];
    Object.entries(errors).forEach(([errorKey, errorValue]) => {
      errorTexts.push(this.getErrorStr(errorKey, errorValue));
    });
    return errorTexts;
  }

  private getErrorStr(errorCode: string, errorData: unknown): string {
    switch (errorCode) {
      case 'required':
        return 'Поле обязательно для заполнения';
      case 'minlength':
        const { requiredLength, actualLength } = errorData as MinLengthValidationInfo;
        const remaining = requiredLength - actualLength;
        return `Нужно ещё ${remaining} символов (минимум ${requiredLength})`;
      default:
        return 'Ошибка в заполнении поля';
    }
  }
}
