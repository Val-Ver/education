import { Component, EventEmitter, inject, Input, Output, SimpleChanges, input, computed, effect, Signal } from '@angular/core';

import { ArticlesStoreService } from '../../../services/articles/articles-store.service';
import { ARTICLES_DATA_SERVICE } from '../../../services/articles/articles-data.token';
import { IArticlesDataService } from '../../../services/articles/articles-data.interface';

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
  public visible = input<boolean>(false);
  public articleToEdit = input<ArticleModel | null>(null);
  @Output() close = new EventEmitter();

  articleForm: FormGroup;
  private store = inject(ArticlesStoreService);
  private dataService = inject(ARTICLES_DATA_SERVICE) as IArticlesDataService;
  private fb = inject(FormBuilder);

  protected formTitle = computed(() => {
    return this.articleToEdit() ? 'Изменить статью' : 'Создать статью';
  });

  protected saveButtonTitle = computed(() => {
    return this.articleToEdit() ? 'Сохранить' : 'Добавить';
  });

  constructor() {
    this.articleForm = this.fb.group({
      heading: ['', [Validators.required, Validators.minLength(25)]],
      content: ['', Validators.required],
    });

    this.editDataEffect();
  }

  private editDataEffect(): void {
    effect(() => {
      const isVisible = this.visible();
      const editArticle = this.articleToEdit();

      if (!isVisible) {
        return;
      }

      if (editArticle) {
        this.articleForm.patchValue({
          heading: editArticle.heading,
          content: editArticle.content,
        });
      } else {
        this.articleForm.reset();
      }
    });
  }

  onSubmit(): void {
    if (this.articleForm.invalid) return;
    const { heading, content } = this.articleForm.value;
    const currentEdit = this.articleToEdit();
    if (currentEdit) {
      const updatedArticle: ArticleModel = {
        id: currentEdit.id,
        heading: heading,
        content: content,
        dateTime: currentEdit.dateTime,
        img: currentEdit.img,
      };

      this.dataService.updateArticle(updatedArticle).subscribe((allArticles) => {
        this.store.setArticles(allArticles);
        this.onCancel();
      });

    } else {
      const newArticle: ArticleModel = {
        id: Date.now().toString(),
        heading: heading,
        content: content,
        dateTime: this.formatDateTime(new Date()),
        img: 'assets/img/begin.jpeg',
      };

      this.dataService.addArticle(newArticle).subscribe((allArticles) => {
        this.store.setArticles(allArticles);
        this.onCancel();
      });
    }
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
