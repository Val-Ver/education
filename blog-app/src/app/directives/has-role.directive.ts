import { Directive, Input, TemplateRef, ViewContainerRef, inject, OnDestroy, effect } from '@angular/core';
import { AuthStore } from '../services/auth/auth.store';

@Directive({
  selector: '[appHasRole]',
  standalone: true,
})
export class HasRoleDirective implements OnDestroy {
  private templateRef = inject(TemplateRef<any>);
  private viewContainer = inject(ViewContainerRef);
  private authStore = inject(AuthStore);

  @Input() appHasRole: string = '';

  private effectRef = effect(() => {
    const user = this.authStore.user();
    const hasRole = user?.roles?.includes(this.appHasRole) ?? false;
    if (hasRole) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  });

  ngOnDestroy(): void {
    this.effectRef.destroy();
  }
}
