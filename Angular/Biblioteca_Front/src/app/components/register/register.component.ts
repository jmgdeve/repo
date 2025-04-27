import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-register',
  imports: [FormsModule],
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

  constructor(private authService: AuthService) { }

  register(): void {
    this.authService.register(this.user).subscribe({
      next: response => {
        this.message = response.message;
      },
      error: (err) => {
        this.message = err.error.message || 'Error al registrar el usuario';
      }
    });
  }

}
