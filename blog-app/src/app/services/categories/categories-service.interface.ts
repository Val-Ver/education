import { Observable } from 'rxjs';
import { CategoryModel } from '../../models/category.model';

export interface ICategoriesService {
  getAll(): Observable<CategoryModel[]>;
  create(name: string): Observable<CategoryModel>;
}
