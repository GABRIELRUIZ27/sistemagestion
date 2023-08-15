import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UsuarioService } from '../core/services/usuario.service';
import { Usuario } from '../models/usuario'; // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-administrador',
  templateUrl: './administrador.component.html',
  styleUrls: ['./administrador.component.css']
})
export class AdministradorComponent implements OnInit {
  formulario!: FormGroup;
  usuarios: Usuario[] = [];
  filtroTexto: string = '';
  nuevoUsuario: Usuario = { id: '', Rol: '', nombre: '', Correo: '', password: '', Estatus: '' }; // Nueva instancia de Usuario
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

  constructor(private modalService: NgbModal, private usuarioService: UsuarioService, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.obtenerUsuarios();
    // Inicialización del formulario
    this.formulario = this.formBuilder.group({
      Rol: ['', Validators.required],
      nombre: ['', Validators.required],
      Correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      Estatus: ['', Validators.required]
    });
  }

  obtenerUsuarios() {
    this.usuarioService.obtenerUsuarios().subscribe({
      next: (usuarios: Usuario[]) => {
        this.usuarios = usuarios;
      },
      error: (error) => {
        console.error('Error al obtener la lista de usuarios:', error);
      }
    });
  }


  cambiarEstatus(nuevoEstatus: string) {
    this.nuevoUsuario.Estatus = nuevoEstatus;
    console.log("Estatus actualizado:", this.nuevoUsuario.Estatus);
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
passwordValue: string = '';


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
      Rol: this.formulario.get('Rol')?.value,
      nombre: this.formulario.get('nombre')?.value,
      Correo: this.formulario.get('Correo')?.value,
      Estatus: this.nuevoUsuario.Estatus
    };

    this.empleados.push(nuevoUsuario);
    this.todosLosEmpleados.push(nuevoUsuario); // Actualizar la lista completa de empleados
    this.formulario.reset();
    this.nuevoUsuario = { id: '', Rol: '', nombre: '', Correo: '', password: '', Estatus: '' };

    if (this.modalRef) {
      this.modalRef.close();
    }
  } else {
    this.mostrarAvisoGeneral = true;
  }
}


buscarCandidato(event: any) {
  const valor = event.target.value;
  if (valor.trim() === '') {
    this.empleados = this.todosLosEmpleados; // Mostrar todos los empleados cuando no hay valor de búsqueda
  } else {
    const filtro = valor.toLowerCase();
    this.empleados = this.todosLosEmpleados.filter(empleado => {
      return (
        empleado.nombre.toLowerCase().includes(filtro) || // Filtrar por nombre
        empleado.Correo.toLowerCase().includes(filtro) // Filtrar por correo electrónico
      );
    });
  }
}


borrarFiltro() {
  this.filtroTexto = ''; // Borra el contenido del filtro
  this.mostrarTodosLosValores(); // Muestra todos los valores nuevamente
}

mostrarTodosLosValores() {
  this.empleados = this.todosLosEmpleados.slice(); // Copia los valores de todosLosEmpleados al arreglo empleados
}


eliminarUsuario(index: number) {
  this.empleados.splice(index, 1);
  this.todosLosEmpleados.splice(index, 1); // Eliminar el usuario de la lista completa
}

editarUsuarioModal(content: any, index: number) {
  this.nuevoUsuarioIndex = index;
  this.nuevoUsuario = { ...this.empleados[index] }; // Copia los valores del usuario a editar

  // Cargar los valores del usuario en el formulario antes de abrir el modal
  this.formulario.setValue({
    Rol: this.nuevoUsuario.Rol,
    nombre: this.nuevoUsuario.nombre,
    Correo: this.nuevoUsuario.Correo,
    password: '', // Aquí proporciona un valor vacío o un valor por defecto para 'password'
    Estatus: this.nuevoUsuario.Estatus // Asegúrate de que 'Estatus' esté incluido si es necesario
  });

  this.modalRef = this.modalService.open(content);
}

guardarCambios(modal: any) {
  if (this.formulario.valid) {
    const valoresFormulario = this.formulario.value;

    // Actualiza los valores del usuario en el arreglo empleados
    this.empleados[this.nuevoUsuarioIndex] = {
      ...this.empleados[this.nuevoUsuarioIndex],
      Rol: valoresFormulario.Rol,
      nombre: valoresFormulario.nombre,
      Correo: valoresFormulario.Correo,
      Estatus: this.nuevoUsuario.Estatus
    };
    this.formulario.reset();
    modal.close();
  }
}
}
