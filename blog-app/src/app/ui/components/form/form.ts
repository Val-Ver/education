import { Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
  selector: 'app-form',
  // imports: [],
  templateUrl: './form.html',
  styleUrl: './form.scss',
  standalone: true,
})
export class Form {
  @Input() visible = false;
  @Output() close = new EventEmitter();

  onCancel() {
    this.close.emit();
  }
}
