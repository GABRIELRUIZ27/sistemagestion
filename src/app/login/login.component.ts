import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  @ViewChild('emailInput') emailInput!: ElementRef<HTMLInputElement>;
  @ViewChild('passwordInput') passwordInput!: ElementRef<HTMLInputElement>;

  constructor(private router: Router, private http: HttpClient) {}

  onSubmit() {
    const enteredEmail = this.emailInput.nativeElement.value;
    const enteredPassword = this.passwordInput.nativeElement.value;

    // Comprueba las credenciales
    if (enteredEmail === 'admin' && enteredPassword === '123') {
      // Realiza la redirección
      this.router.navigate(['/inicio']);
    } else {
      alert('Credenciales inválidas');
    }
  }
}
