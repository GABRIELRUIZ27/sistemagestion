import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../../models/usuario';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'https://mocki.io/v1/54034ed1-3703-4a5c-8553-60f6c5599252'; // Cambia esto a la URL de tu API

  constructor(private http: HttpClient) {}

  obtenerUsuarios(): Observable<Usuario[]> {
    const url = `${this.apiUrl}/candidatos_registro`;
    return this.http.get<Usuario[]>(url); // Realiza la llamada GET para obtener la lista de usuarios
  }

  agregarUsuario(nuevoUsuario: Usuario) {
    const url = `${this.apiUrl}/candidatos_registro`;
    return this.http.post(url, nuevoUsuario); // Realiza la llamada POST para agregar el usuario
  }

  editarUsuario(index: number, valoresFormulario: any) {
    const url = `${this.apiUrl}/candidatos_registro/${index}`;
    return this.http.put(url, valoresFormulario); // Realiza la llamada PUT para editar el usuario
  }

  eliminarUsuario(id: string) {
    const url = `${this.apiUrl}/candidatos_registro/${id}`;
    return this.http.delete(url); // Realiza la llamada DELETE para eliminar el usuario
  }
}
