import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private viewportScroller = inject(ViewportScroller);

  scrollToContact() {
    this.viewportScroller.scrollToAnchor('contact');
  }
}
