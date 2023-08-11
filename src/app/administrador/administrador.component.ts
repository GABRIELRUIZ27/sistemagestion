import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../core/services/usuario.service';
import { Usuario } from '../models/usuario';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-administrador',
  templateUrl: './administrador.component.html', // Asegúrate de que esta ruta sea correcta
  styleUrls: ['./administrador.component.css']
})

export class AdministradorComponent implements OnInit {
  usuarios: Usuario[] = []; // Array para almacenar los usuarios

  formulario: FormGroup; // Declarar la propiedad 'formulario'


  nuevoUsuario: any = {};

  mostrarAdvertenciaContrasena: boolean = false;
  campoContrasenaSeleccionado: boolean = false;
  modalRef: NgbModalRef | null = null;
  todosLosEmpleados: any[] = [];
  valorBusqueda: string = '';
  filtroTexto: string = '';
  nuevoUsuarioIndex: number = -1;
  estatusSeleccionado: string = '';
  filtroAplicado: string = '';
  modalService: any;
  datosObtenidos: any;

  constructor(private usuarioService: UsuarioService, private fb: FormBuilder, private http: HttpClient) {
    // Inicializar el formulario en el constructor
    this.formulario = this.fb.group({
      Rol: ['', Validators.required],
      nombre: ['', Validators.required],
      Correo: ['', Validators.required],
      password: ['', Validators.required],
      Estatus: [''],
    });
  }
  ngOnInit() {
    // Llama a la función para obtener la lista de usuarios al inicializar el componente
    this.obtenerUsuarios();
  }

  // Función para obtener la lista de usuarios desde la API
  obtenerUsuarios() {
    this.http.get('http://www.conocelos.somee.com/candidatos_registro')
      .subscribe(
        (data: any) => {
          this.usuarios = data; // Asigna los usuarios obtenidos a la propiedad "usuarios"
          console.log('Usuarios obtenidos:', this.usuarios);
        },
        (error) => {
          console.error('Error al obtener usuarios:', error);
        }
      );
  }

  // Función para agregar un nuevo usuario
  agregarUsuario() {
    const nuevoUsuario: Usuario = this.formulario.value;
    this.usuarioService.agregarUsuario(nuevoUsuario).subscribe(
      () => {
        // Actualiza la lista de usuarios después de agregar uno nuevo
        this.obtenerUsuarios();
      },
      (error) => {
        console.error('Error al agregar usuario:', error);
      }
    );
  }

  // Función para editar un usuario existente
  editarUsuario(index: number) {
    const valoresFormulario = this.formulario.value;
    this.usuarioService.editarUsuario(index, valoresFormulario).subscribe(
      () => {
        // Actualiza la lista de usuarios después de editar
        this.obtenerUsuarios();
      },
      (error) => {
        console.error('Error al editar usuario:', error);
      }
    );
  }

  // Función para eliminar un usuario
  eliminarUsuario(id: string) {
    this.usuarioService.eliminarUsuario(id).subscribe(
      () => {
        // Actualiza la lista de usuarios después de eliminar
        this.obtenerUsuarios();
      },
      (error) => {
        console.error('Error al eliminar usuario:', error);
      }
    );
  }

  cambiarEstatus(nuevoEstatus: string) {
    this.nuevoUsuario.Estatus = nuevoEstatus;
    console.log("Estatus actualizado:", this.nuevoUsuario.Estatus);
  }

  openModal(content: any): void {
    // Asegúrate de que el servicio de modal está inicializado correctamente
    if (this.modalService) {
      this.modalRef = this.modalService.open(content);
    }
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

  mostrarContrasena: boolean = false;

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

mostrarAvisoGeneral: boolean = false;

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
    const nuevoUsuario: Usuario = {
      nombre: this.formulario.get('nombre')?.value,
      Correo: this.formulario.get('Correo')?.value,
      password: 'Password',
      Estatus: this.nuevoUsuario.Estatus,
      id: '',
      Rol: ''
    };

    // Resto del código para agregar el usuario
  } else {
    this.mostrarAvisoGeneral = true;
  }
}



buscarCandidato(event: any) {
  const valor = event.target.value;
  if (valor.trim() === '') {
    this.usuarios = this.todosLosEmpleados; // Mostrar todos los empleados cuando no hay valor de búsqueda
  } else {
    const filtro = valor.toLowerCase();
    this.usuarios = this.todosLosEmpleados.filter(empleado => {
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
  this.usuarios = this.todosLosEmpleados.slice(); // Copia los valores de todosLosEmpleados al arreglo empleados
}


editarUsuarioModal(content: any, index: number) {
  this.nuevoUsuarioIndex = index;
  this.nuevoUsuario = { ...this.usuarios[index] }; // Copia los valores del usuario a editar

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
    this.usuarios[this.nuevoUsuarioIndex] = {
      ...this.usuarios[this.nuevoUsuarioIndex],
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
