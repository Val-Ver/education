import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { ARTICLES_DATA_SERVICE } from './services/articles/articles-data.token';
import { ArticlesDataService } from './services/articles/articles-data.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    {
      provide: ARTICLES_DATA_SERVICE,
      useClass: ArticlesDataService,
    },
  ],
};
