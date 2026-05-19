import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { CategoryModel } from '../../models/category.model';
import { ICategoriesService } from './categories-service.interface';

@Injectable()
export class MockCategoriesService implements ICategoriesService {
  getAll(): Observable<CategoryModel[]> {
    return of([]);
  }
  create(name: string): Observable<CategoryModel> {
    return throwError(() => new Error('Категории недоступны в local-режиме'));
  }
}
