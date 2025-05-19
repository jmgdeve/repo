import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  user = {
    name: '',
    email: '',
    password: '',
    role: 'USER' // Role predefinido por ahora

  };
  message = '';

  constructor(private authService: AuthService, private router: Router) { }

  register(): void {
    this.authService.register(this.user).subscribe({
      next: response => {
        this.message = response.message;
        setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1000);
      },
      error: (err) => {
        this.message = err.error.message || 'Error al registrar el usuario';
      }
    });
  }
   goToLogin(): void {
    this.router.navigate(['/login']);
  }

}
