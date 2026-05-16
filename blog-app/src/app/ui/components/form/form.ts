import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  SimpleChanges,
  input,
  computed,
  effect,
  Signal,
  signal,
} from '@angular/core';

import { ArticlesStoreService } from '../../../services/articles/articles-store.service';
import { ARTICLES_DATA_SERVICE } from '../../../services/articles/articles-data.token';
import { IArticlesDataService } from '../../../services/articles/articles-data.interface';

import {ArticleModel} from '../../../models/article.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { CategoriesService } from '../../../services/categories/categories.service';
import { CategoryModel } from '../../../models/category.model';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {environment} from '../../../../environments/environment';


interface MinLengthValidationInfo {
  requiredLength: number;
  actualLength: number;
}

@Component({
  selector: 'app-form',
  imports: [ReactiveFormsModule, MatAutocompleteModule, MatInputModule, MatFormFieldModule],
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

  protected selectedFile = signal<File | null>(null);
  protected selectedFileName = computed(() => this.selectedFile()?.name || '');

  private categoriesService = inject(CategoriesService);
  protected allCategories = signal<CategoryModel[]>([]);
  protected filteredCategories = signal<CategoryModel[]>([]);
  protected useBackend = environment.useBackend;

  constructor() {
    this.articleForm = this.fb.group({
      heading: ['', [Validators.required, Validators.minLength(25)]],
      content: ['', Validators.required],
      category: [''],
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
          category: editArticle.categoryName || '',
        });
      } else {
        this.articleForm.reset();
        this.articleForm.get('category')?.setValue('');
      }
    });
  }

  onSubmit(): void {
    if (this.articleForm.invalid) return;
    const { heading, content, category } = this.articleForm.value;
    const currentEdit = this.articleToEdit();
    const saveArticle = (categoryId?: string) => {
      if (currentEdit) {
        const updatedArticle: ArticleModel = {
          id: currentEdit.id,
          heading: heading,
          content: content,
          dateTime: currentEdit.dateTime,
          img: currentEdit.img,
          rating: currentEdit.rating,
          categoryId: categoryId,
          categoryName: category,
        };

        this.dataService
          .updateArticle(updatedArticle, this.selectedFile() ?? undefined, categoryId)
          .subscribe({
            next: (allArticles) => {
              this.store.setArticles(allArticles);
              this.onCancel();
            },
              error: (err) => console.error('Ошибка обновления', err)
          });
      } else {
        const newArticle: ArticleModel = {
          id: Date.now().toString(),
          heading: heading,
          content: content,
          dateTime: this.formatDateTime(new Date()),
          img: 'assets/img/begin.jpeg',
          rating: 0,
          categoryId: categoryId,
          categoryName: category,
        };

        this.dataService
          .addArticle(newArticle, this.selectedFile() ?? undefined, categoryId)
          .subscribe({
            next: (allArticles) => {
              this.store.setArticles(allArticles);
              this.onCancel();
            },
            error: (err) => console.error('Ошибка создания', err),
          });
      }
      //this.onCancel();
    };
    if (category && category.trim()) {
      const trimmedName = category.trim();
      const existingCategory = this.allCategories().find(
        (oneCategory) => oneCategory.name.toLowerCase() === trimmedName.toLowerCase(),
      );
      if (existingCategory) {
        saveArticle(existingCategory.id);
      } else {
        this.categoriesService.create(trimmedName).subscribe({
          next: (newCat) => {
            this.allCategories.update((list) => [...list, newCat]);
            this.filteredCategories.update((list) => [...list, newCat]);
            saveArticle(newCat.id);
          },
          error: (err) => console.error('Ошибка создания категории', err),
        });
      }
    } else {
      saveArticle(undefined);
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
    this.selectedFile.set(null);
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
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile.set(input.files[0]);
    } else {
      this.selectedFile.set(null);
    }
  }

  ngOnInit(): void {
    this.loadCategories();
    this.articleForm.get('category')?.valueChanges.subscribe((value) => {
      this.filterCategories(value || '');
    });
  }

  private loadCategories(): void {
    if (!this.useBackend) return;
    this.categoriesService.getAll().subscribe({
      next: (categories) => {
        this.allCategories.set(categories);
        this.filteredCategories.set(categories);
      },
      error: (err) => console.error('Ошибка загрузки категорий', err),
    });
  }
  protected filterCategories(searchTerm: string): void {
    const term = searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredCategories.set(this.allCategories());
      return;
    }
    const filtered = this.allCategories().filter((cat) => cat.name.toLowerCase().includes(term));
    this.filteredCategories.set(filtered);
  }
  protected displayCategoryName(name: string): string {
    return name || '';
  }
}
