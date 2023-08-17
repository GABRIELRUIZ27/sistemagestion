import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Usuario } from '../../models/usuario';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'http://www.conocelos.somee.com/candidatos_registro';

  constructor(private http: HttpClient) {}

  obtenerUsuarios(): Observable<Usuario[]> {
    const url = `${this.apiUrl}/candidatos_registro`;
    const headers = this.getHeaders(); // Obtener las cabeceras con las credenciales
    return this.http.get<Usuario[]>(url, { headers });
  }

  agregarUsuario(nuevoUsuario: Usuario) {
    const url = `${this.apiUrl}/candidatos_registro`;
    const headers = this.getHeaders(); // Obtener las cabeceras con las credenciales
    return this.http.post(url, nuevoUsuario, { headers });
  }

  editarUsuario(index: number, valoresFormulario: any) {
    const url = `${this.apiUrl}/candidatos_registro/${index}`;
    const headers = this.getHeaders(); // Obtener las cabeceras con las credenciales
    return this.http.put(url, valoresFormulario, { headers });
  }

  eliminarUsuario(id: string) {
    const url = `${this.apiUrl}/candidatos_registro/${id}`;
    const headers = this.getHeaders(); // Obtener las cabeceras con las credenciales
    return this.http.delete(url, { headers });
  }

  private getHeaders(): HttpHeaders {
    const credentials = 'admin:123';
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa(credentials)
    });
    return headers;
  }
}
