import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  user = {
    email: '',
    password: ''
  };
  message = '';

  constructor(private authService: AuthService, private router: Router) { }

  login(): void {
    this.authService.login(this.user).subscribe({
      next: response => {
        this.message = response.message;
        localStorage.setItem('user', JSON.stringify(response.user)); // Guardar el usuario en localStorage
        localStorage.setItem('jwt', response.token); // Guardar el token en localStorage
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.message = err.error.message || 'Error al iniciar sesión';
      }
    });
  }

}
