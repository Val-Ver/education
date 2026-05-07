import { Component, EventEmitter, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'app-admin-panel',
  imports: [MatIconModule, MatIconButton],
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.scss',
  standalone: true,
})
export class AdminPanel {
  @Output() creatPost = new EventEmitter();
  @Output() showStats = new EventEmitter();

  showForm() {
    this.creatPost.emit();
  }
  showModal() {
    this.showStats.emit();
  }
}
