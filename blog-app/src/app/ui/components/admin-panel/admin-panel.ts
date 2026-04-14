import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-admin-panel',
  imports: [],
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.scss',
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
