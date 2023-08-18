import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

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

    const apiUrl = 'http://www.conocelos.somee.com/api/UsuarioVerificar/Autenticar';

    // Realiza una solicitud POST para autenticar al usuario
    const body = {
      nombreUsuario: enteredEmail,
      clave: enteredPassword
    };

    this.http.post(apiUrl, body)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error(error);
          return throwError('Credenciales inválidas');
        })
      )
      .subscribe((data: any) => {
        // Autenticación exitosa: guardar el token y redirigir
        const token = data.token;
        localStorage.setItem('bearerToken', token);
        console.log('Token:', token); // Imprimir el token en la consola
        this.router.navigate(['/inicio']);
      });
  }
}
