import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { ARTICLES_DATA_SERVICE } from './services/articles/articles-data.token';
import { ArticlesDataService } from './services/articles/articles-data.service';
import { provideHttpClient } from '@angular/common/http';

import { LocalStorageArticlesDataService } from './services/articles/implementations/local-storage-articles-data.service';
import { HttpArticlesDataService } from './services/articles/implementations/http-articles-data.service';
import { environment } from '../environments/environment';

import { CATEGORIES_SERVICE } from './services/categories/categories.token';
import { HttpCategoriesService } from './services/categories/http-categories.service';
import { MockCategoriesService } from './services/categories/mock-categories.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    {
      provide: ARTICLES_DATA_SERVICE,
      useClass: environment.useBackend ? HttpArticlesDataService : LocalStorageArticlesDataService,
    },
    {
      provide: CATEGORIES_SERVICE,
      useClass: environment.useBackend ? HttpCategoriesService : MockCategoriesService,
    },
  ],
};
