import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AUTH_SERVICE } from '../../../services/auth/auth.token';
import { IAuthService } from '../../../services/auth/auth-service.interface';
import { AuthStore } from '../../../services/auth/auth.store';
import { RegisterDialog } from '../register-dialog/register-dialog';

@Component({
  selector: 'app-login-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Вход</h2>
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Логин</mat-label>
          <input matInput formControlName="username" required>
        </mat-form-field>
        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Пароль</mat-label>
          <input matInput type="password" formControlName="password" required>
        </mat-form-field>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="onCancel()">Отмена</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">Войти</button>
        <button mat-button type="button" (click)="openRegister()">Регистрация</button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [`.full-width { width: 100%; }`]
})
export class LoginDialog {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<LoginDialog>);
  private authService = inject(AUTH_SERVICE);
  private authStore = inject(AuthStore);
  private dialog = inject(MatDialog);

  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  onSubmit() {
    if (this.form.invalid) return;
    const { username, password } = this.form.value;
    this.authService.login({ username: username!, password: password! }).subscribe({
      next: (user) => {
        this.authStore.setUser(user);
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('Login failed', err);
      }
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

  openRegister() {
    this.dialogRef.close();
    this.dialog.open(RegisterDialog);
  }
}
