import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-administrador',
  templateUrl: './administrador.component.html',
  styleUrls: ['./administrador.component.css']
})
export class AdministradorComponent {
  empleados: any[] = [];

  nuevoUsuario: any = {};

  formulario: FormGroup;
  mostrarAdvertenciaContrasena: boolean = false;
  campoContrasenaSeleccionado: boolean = false;
  modalRef: NgbModalRef | null = null;
  todosLosEmpleados: any[] = [];
  valorBusqueda: string = '';
  filtroTexto: string = '';

  constructor(private modalService: NgbModal, private fb: FormBuilder) {
    this.formulario = this.fb.group({
      role: [''],
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, this.validarContrasena]],
    });
  }

  estatusSeleccionado: string = ''; // Agrega esta propiedad

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
    this.formulario.get('role')?.setValue(null);
    this.mostrarAdvertenciaContrasena = false;
  }

  mostrarContrasena: boolean = false;

toggleMostrarContrasena(): void {
    this.mostrarContrasena = !this.mostrarContrasena;
}
passwordValue: string = '';

validarCriteriosContrasena(password: string) {
    const passwordControl = this.formulario.get('password');
    if (passwordControl) {
        passwordControl.setValue(password);

        this.mostrarAdvertenciaContrasena = passwordControl.dirty && !passwordControl.valid;
    }
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
      return password.length >= 8;
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


agregarUsuario() {
  if (this.formulario.valid) {
    const nuevoUsuario = {
      Rol: this.formulario.get('role')?.value,
      nombre: this.formulario.get('nombre')?.value,
      Correo: this.formulario.get('email')?.value,
      Estatus: this.nuevoUsuario.Estatus
    };

    this.empleados.push(nuevoUsuario);
    this.formulario.reset();
    this.nuevoUsuario = {};
    this.nuevoUsuario.Estatus = ''; // Reinicia el estatus seleccionado
  }
}

agregarUsuarioYCerrarModal() {
  if (this.formulario.valid) {
    const nuevoUsuario = {
      Rol: this.formulario.get('role')?.value,
      nombre: this.formulario.get('nombre')?.value,
      Correo: this.formulario.get('email')?.value,
      Estatus: this.nuevoUsuario.Estatus
    };

    this.empleados.push(nuevoUsuario);
    this.todosLosEmpleados.push(nuevoUsuario); // Actualizar la lista completa de empleados
    this.formulario.reset();
    this.nuevoUsuario = {};

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


}
