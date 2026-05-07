import { Injectable, inject, DestroyRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class PageTitleService {
  private title = inject(Title);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  constructor() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.updateTitle();
      });
  }

  private updateTitle(): void {
    let currentRoute = this.router.routerState.snapshot.root;
    let routeTitle = '';

    while (currentRoute.firstChild) {
      currentRoute = currentRoute.firstChild;
      if (currentRoute.routeConfig && currentRoute.routeConfig.title) {
        routeTitle = currentRoute.routeConfig.title as string;
        break;
      }
    }

    const finalTitle = routeTitle ? `${routeTitle}`: 'Блог Ведьмака';
    this.title.setTitle(finalTitle);
  }

  public setCustomTitle(pageTitle: string): void {
    this.title.setTitle(`${pageTitle}`);
  }
}
