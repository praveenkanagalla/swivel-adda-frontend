import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule, RouterModule],
  templateUrl: './auth.html',
  styleUrls: ['./auth.css']   // ✅ fixed (plural)
})
export class Auth {
  isLoginMode = true;

  loginData = { email: '', password: '' };
  registerData = { name: '', email: '', password: '' };

  constructor(private http: HttpClient, private router: Router) { }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onLogin(form: NgForm) {
    if (form.invalid) return;

    this.http.post(`${environment.apiUrl}/login`, this.loginData).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('name', res.name);
        localStorage.setItem('email', res.email);

        // redirect to home/dashboard
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Login failed', err);
        alert(err.error?.message || 'Login failed');
      }
    });
  }

  onRegister(form: NgForm) {
    if (form.invalid) return;

    this.http.post(`${environment.apiUrl}/register`, this.registerData).subscribe({
      next: (res: any) => {
        alert(res.message || 'Registration successful');

        // ✅ switch to login mode after successful registration
        this.isLoginMode = true;

        // clear form
        form.resetForm();
        this.registerData = { name: '', email: '', password: '' };
      },
      error: (err) => {
        console.error('Registration error:', err);
        alert(err.error?.message || 'Registration failed');
      }
    });
  }
}