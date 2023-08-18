import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UsuarioService } from '../core/services/usuario.service';
import { Usuario } from '../models/usuario';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-administrador',
  templateUrl: './administrador.component.html',
  styleUrls: ['./administrador.component.css']
})
export class AdministradorComponent implements OnInit {
  formulario!: FormGroup;
  usuarios: Usuario[] = [];
  filtroTexto: string = '';
  nuevoUsuario: Usuario = {
    rolId: 0, email: '', passwordUser: '', statusUser: true,
    isAuthenticated: false,
    bearerToken: ''
  };
  mostrarAvisoGeneral: boolean = false;
  campoContrasenaSeleccionado: boolean = false;
  mostrarContrasena: boolean = false;
  empleados: any[] = [];
  mostrarAdvertenciaContrasena: boolean = false;
  modalRef: NgbModalRef | null = null;
  todosLosEmpleados: any[] = [];
  valorBusqueda: string = '';
  nuevoUsuarioIndex: number = -1;
  estatusSeleccionado: string = '';
  filtroAplicado: string = '';

  constructor(private modalService: NgbModal, private usuarioService: UsuarioService, private formBuilder: FormBuilder, private http: HttpClient) {
    this.formulario = this.formBuilder.group({
      Rol: [null, Validators.required],
      nombre: ['', Validators.required],
      Correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      Estatus: [true]
    });
  }

  ngOnInit(): void {
    this.obtenerUsuariosConToken();
  }

  obtenerUsuariosConToken() {
    const token = localStorage.getItem('bearerToken');
    if (token) {
      this.usuarioService.obtenerUsuarios(token).subscribe({
        next: (usuarios: Usuario[]) => {
          this.usuarios = usuarios;
        },
        error: (error) => {
          console.error('Error al obtener la lista de usuarios:', error);
        }
      });
    }
  }

  cambiarEstatus(nuevoEstatus: boolean) {
    this.nuevoUsuario.statusUser = nuevoEstatus;
    console.log("Estatus actualizado:", this.nuevoUsuario.statusUser);
  }

  openModal(content: any): void {
    this.modalRef = this.modalService.open(content);
  }

  closeModal(modal: any): void {
    modal.dismiss();
  }

  sendMessage(): void {
    console.log('Mensaje enviado');
  }

  validarContrasena(control: any) {
    const password = control.value;
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/;

    if (regex.test(password)) {
      return null;
    } else {
      return { contrasenaInvalida: true };
    }
  }

mostrarMensajeAdvertencia() {
  this.mostrarAdvertenciaContrasena = true;
}

ocultarMensajeAdvertencia() {
  this.mostrarAdvertenciaContrasena = false;
}

limpiarFormulario(): void {
  this.formulario.reset();
  this.formulario.get('Rol')?.setValue(null);
  this.mostrarAdvertenciaContrasena = false;
}

toggleMostrarContrasena(): void {
  this.mostrarContrasena = !this.mostrarContrasena;
}

cumpleRequisito(requisito: string): boolean {
  const passwordControl = this.formulario.get('password');

  if (!passwordControl) {
    return false;
  }

  const password = passwordControl.value;

  if (requisito === 'mayuscula') {
    return /[A-Z]/.test(password);
  } else if (requisito === 'caracterEspecial') {
    return /[$@$!%*?&]/.test(password);
  } else if (requisito === 'minimoCaracteres') {
    return password != null && password.length >= 8;
  }

  return false;
}

validarFormulario() {
  this.mostrarAvisoGeneral = false;

  if (this.formulario.invalid) {
      this.mostrarAvisoGeneral = true;
  }
}

sendMessageAndClose(modal: any): void {
  this.validarFormulario();
  if (!this.mostrarAvisoGeneral) {
      this.sendMessage();
      this.closeModal(modal);
  }
}

agregarUsuarioYCerrarModal() {
  if (this.formulario.valid) {
    const nuevoUsuario = {
      rolId: this.formulario.get('Rol')?.value,
      email: this.formulario.get('nombre')?.value,
      passwordUser: this.formulario.get('Correo')?.value,
      statusUser: this.nuevoUsuario.statusUser,
      isAuthenticated: true,
      bearerToken: ''
    };

    const token = localStorage.getItem('bearerToken');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

    this.http.post('http://www.conocelos.somee.com/usuarios_registro', nuevoUsuario, { headers }).subscribe(
      (respuesta) => {
        // Manejar la respuesta en caso de éxito
        console.log('Usuario agregado exitosamente:', respuesta);

        // Limpiar el formulario y cerrar el modal
        this.formulario.reset();
        this.modalRef?.close();
      },
      (error) => {
        // Manejar el error
        console.error('Error al agregar el usuario:', error);
      }
    );
  } else {
    this.mostrarAvisoGeneral = true;
  }
}




buscarCandidato(event: any) {
  const valor = event.target.value;
  if (valor.trim() === '') {
    this.empleados = this.todosLosEmpleados;
  } else {
    const filtro = valor.toLowerCase();
    this.empleados = this.todosLosEmpleados.filter(empleado => {
      return (
        empleado.email.toLowerCase().includes(filtro)
      );
    });
  }
}

borrarFiltro() {
  this.filtroTexto = '';
  this.mostrarTodosLosValores();
}

mostrarTodosLosValores() {
  this.empleados = this.todosLosEmpleados.slice();
}

eliminarUsuario(id: number) {
  this.usuarioService.eliminarUsuario(id).subscribe(() => {
    this.obtenerUsuariosConToken();
  });
}

editarUsuarioModal(content: any, index: number) {
  this.nuevoUsuarioIndex = index;
  this.nuevoUsuario = { ...this.empleados[index] };

  // Cargar los valores del usuario en el formulario antes de abrir el modal
  this.formulario.setValue({
    Rol: this.nuevoUsuario.rolId,
    nombre: this.nuevoUsuario.email,
    Correo: this.nuevoUsuario.passwordUser,
    password: '',
    Estatus: this.nuevoUsuario.statusUser
  });

  this.modalRef = this.modalService.open(content);
}

guardarCambios(modal: any) {
  if (this.formulario.valid) {
    const valoresFormulario = this.formulario.value;

    // Actualiza los valores del usuario en el arreglo empleados
    this.empleados[this.nuevoUsuarioIndex] = {
      ...this.empleados[this.nuevoUsuarioIndex],
      rolId: valoresFormulario.Rol,
      email: valoresFormulario.nombre,
      passwordUser: valoresFormulario.Correo,
      statusUser: this.nuevoUsuario.statusUser
    };
    this.formulario.reset();
    modal.close();
  }
}
}


