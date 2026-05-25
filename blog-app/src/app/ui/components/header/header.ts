import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ViewportScroller } from '@angular/common';

import { MatDialog } from '@angular/material/dialog';
import { AuthStore } from '../../../services/auth/auth.store';
import { AUTH_SERVICE } from '../../../services/auth/auth.token';
import { LoginDialog } from '../login-dialog/login-dialog';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  standalone: true,
})
export class Header {
  private viewportScroller = inject(ViewportScroller);
  private dialog = inject(MatDialog);
  authStore = inject(AuthStore);
  private authService = inject(AUTH_SERVICE);

  scrollToContact() {
    this.viewportScroller.scrollToAnchor('contact');
  }
  openLoginDialog() {
    this.dialog.open(LoginDialog);
  }

  logout() {
    this.authService.logout();
    this.authStore.setUser(null);
  }
}
