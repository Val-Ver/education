import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-modal-dialog',
  imports: [],
  templateUrl: './modal-dialog.html',
  styleUrl: './modal-dialog.scss',
})
export class ModalDialog {
  @Input() articlesCount = 0;
  @Output() close = new EventEmitter();

  @ViewChild('dialog') dialogRef!: ElementRef<HTMLDialogElement>;

  ngAfterViewInit(): void {
    this.dialogRef.nativeElement.showModal();
  }

  closeModal(): void {
    this.close.emit();
  }
  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeModal();
  }
}
