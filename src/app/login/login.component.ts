import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  @ViewChild('emailInput') emailInput!: ElementRef<HTMLInputElement>;
  @ViewChild('passwordInput') passwordInput!: ElementRef<HTMLInputElement>;

  constructor(private router: Router) {}

  onSubmit() {
    const email = 'usuario@example.com';
    const password = 'contraseña';

    const enteredEmail = this.emailInput.nativeElement.value;
    const enteredPassword = this.passwordInput.nativeElement.value;

    if (enteredEmail === email && enteredPassword === password) {
      this.router.navigate(['/inicio']);
    } else {
      alert('Credenciales inválidas');
    }
  }
}
