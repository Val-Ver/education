import { Component, signal } from '@angular/core';
import { Header } from './ui/components/header/header';
import { Footer } from './ui/components/footer/footer';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [Header, Footer, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  standalone: true,
})
export class App {
  protected readonly title = signal('blog-app');
}
