import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AUTH_SERVICE } from '../../../services/auth/auth.token';
import { AuthStore } from '../../../services/auth/auth.store';

@Component({
  selector: 'app-register-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCheckboxModule],
  template: `
    <h2 mat-dialog-title>Регистрация</h2>
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Логин</mat-label>
          <input matInput formControlName="username" required>
        </mat-form-field>
        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Email</mat-label>
          <input matInput type="email" formControlName="email" required>
        </mat-form-field>
        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Пароль</mat-label>
          <input matInput type="password" formControlName="password" required>
        </mat-form-field>
        <mat-checkbox formControlName="isAdmin">Зарегистрировать как администратора</mat-checkbox>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="onCancel()">Отмена</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">Зарегистрироваться</button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [`.full-width { width: 100%; }`]
})
export class RegisterDialog {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<RegisterDialog>);
  private authService = inject(AUTH_SERVICE);
  private authStore = inject(AuthStore);

  form = this.fb.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    isAdmin: [false],
  });

  onSubmit() {
    if (this.form.invalid) return;
    this.authService.register(this.form.value as any).subscribe({
      next: (user) => {
        this.authStore.setUser(user);
        this.dialogRef.close(true);
      },
      error: (err) => console.error(err)
    });
  }

  onCancel() {
    this.dialogRef.close();
  }
}
