import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { CategoryModel } from '../../models/category.model';
import { ICategoriesService } from './categories-service.interface';
import { environment } from '../../../environments/environment';

@Injectable()
export class HttpCategoriesService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl; // '/api'

  getAll(): Observable<CategoryModel[]> {
    return this.http.get<CategoryModel[]>(`${this.apiUrl}/categories`);
  }

  create(name: string): Observable<CategoryModel> {
    return this.http.post<CategoryModel>(`${this.apiUrl}/categories`, { name });
  }
}
