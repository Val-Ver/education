import {
  ApplicationConfig,
  inject,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { ARTICLES_DATA_SERVICE } from './services/articles/articles-data.token';
//import { provideHttpClient } from '@angular/common/http';

import { LocalStorageArticlesDataService } from './services/articles/implementations/local-storage-articles-data.service';
import { HttpArticlesDataService } from './services/articles/implementations/http-articles-data.service';
import { environment } from '../environments/environment';

import { CATEGORIES_SERVICE } from './services/categories/categories.token';
import { HttpCategoriesService } from './services/categories/http-categories.service';
import { MockCategoriesService } from './services/categories/mock-categories.service';

import { POST_SERVICE } from './services/post/post-service.token';
import { GraphQLPostAdapterService } from './services/post/graphql-post-adapter.service';
import { LocalStoragePostService } from './services/post/local-storage-post.service';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client';

import { AUTH_SERVICE } from './services/auth/auth.token';
import { HttpAuthService } from './services/auth/http-auth.service';
import { LocalAuthService } from './services/auth/local-auth.service';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideApollo(() => {
      const httpLink = inject(HttpLink);
      return {
        link: httpLink.create({ uri: `${environment.apiUrl}/graphql` }),
        cache: new InMemoryCache(),
        defaultOptions: { query: { fetchPolicy: 'network-only' } },
      };
    }),
    {
      provide: ARTICLES_DATA_SERVICE,
      useClass: environment.useBackend ? HttpArticlesDataService : LocalStorageArticlesDataService,
    },
    {
      provide: CATEGORIES_SERVICE,
      useClass: environment.useBackend ? HttpCategoriesService : MockCategoriesService,
    },
    {
      provide: POST_SERVICE,
      useClass: environment.useBackend ? GraphQLPostAdapterService : LocalStoragePostService,
    },
    {
      provide: AUTH_SERVICE,
      useClass: environment.useBackend ? HttpAuthService : LocalAuthService,
    },
  ],
};
