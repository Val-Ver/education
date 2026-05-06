import { InjectionToken } from '@angular/core';
import { IArticlesDataService } from './articles-data.interface';

export const ARTICLES_DATA_SERVICE = new InjectionToken<IArticlesDataService>(
  'ARTICLES_DATA_SERVICE',
);
