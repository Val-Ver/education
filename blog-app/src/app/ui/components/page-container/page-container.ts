import { Component } from '@angular/core';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';
import { MainFirstPage } from '../../pages/main-first-page/main-first-page';

@Component({
  selector: 'app-page-container',
  imports: [Header, Footer, MainFirstPage],
  templateUrl: './page-container.html',
  styleUrl: './page-container.scss',
})
export class PageContainer {}
