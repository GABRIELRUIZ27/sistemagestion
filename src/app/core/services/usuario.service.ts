import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Usuario } from '../../models/usuario';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'http://www.conocelos.somee.com/usuarios_registro';

  constructor(private http: HttpClient) {}

  obtenerUsuarios(token: string): Observable<Usuario[]> {
    const headers = this.getHeaders(token);
    return this.http.get<Usuario[]>(this.apiUrl, { headers })
      .pipe(map((response: any) => response.response));
  }
  agregarUsuario(nuevoUsuario: Usuario) {
    return this.http.post(this.apiUrl, nuevoUsuario);
  }

  editarUsuario(id: string, valoresFormulario: any) {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put(url, valoresFormulario);
  }

    eliminarUsuario(id: number) {
      const token = localStorage.getItem('bearerToken');
      if (token) {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.delete(`${this.apiUrl}/${id}`, { headers });
      } else {
        // Manejo de caso en que el token no está presente
        return throwError('Token no encontrado');
      }
    }
  private getHeaders(token: string): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
}
