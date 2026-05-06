import { Component } from '@angular/core';

@Component({
  selector: 'app-hobby',
  imports: [],
  templateUrl: './hobby.html',
  styleUrl: './hobby.scss',
  standalone: true,
})
export class Hobby {
  magicUrl = 'assets/img/magic.jpeg';
  awordsUrl = 'assets/img/awords.jpeg';
  fishUrl = 'assets/img/fish.jpeg';
  horseUrl = 'assets/img/horse.jpeg';
}
