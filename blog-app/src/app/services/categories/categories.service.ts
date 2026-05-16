import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { CategoryModel } from '../../models/category.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl; // '/api'

  getAll(): Observable<CategoryModel[]> {
    if (!environment.useBackend) {
     // console.log('localStorage: категории не загружаются');
      return of([]);
    }
    return this.http.get<CategoryModel[]>(`${this.apiUrl}/categories`);
  }

  create(name: string): Observable<CategoryModel> {
    if (!environment.useBackend) {
      return throwError(() => new Error('Создание категорий доступно только при включённом бэкенде'));
    }
    return this.http.post<CategoryModel>(`${this.apiUrl}/categories`, { name });
  }
}
