import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-administrador',
  templateUrl: './administrador.component.html',
  styleUrls: ['./administrador.component.css']
})
export class AdministradorComponent {
  empleados = [
    { Rol: 'Usuario', nombre: 'Juan Carlos Martínez García', Correo: 'correo@ejemplo.com', Estatus: 'Activo' },
    { Rol: 'Candidato', nombre: 'Ana María Rodríguez López', Correo: 'correo@ejemplo.com',  Estatus: 'Inactivo' },
    { Rol: 'Candidato', nombre: 'Carlos Eduardo Pérez Sánchez', Correo: 'correo@ejemplo.com', Estatus: 'Activo' },
    { Rol: 'Administrador', nombre: 'María Fernanda González Ramírez', Correo: 'correo@ejemplo.com', Estatus: 'Inactivo' },
    { Rol: 'Usuario', nombre: 'Alejandro Torres Jiménez', Correo: 'correo@ejemplo.com', Estatus: 'Activo' },
    { Rol: 'Usuario', nombre: 'Laura Isabel Castro Vargas', Correo: 'correo@ejemplo.com', Estatus: 'Inactivo' },
    { Rol: 'Candidato', nombre: 'Javier Antonio Mendoza Cruz', Correo: 'correo@ejemplo.com', Estatus: 'Activo' },
    { Rol: 'Usuario', nombre: 'Emanuel Romero Aguilar', Correo: 'correo@ejemplo.com', Estatus: 'Inactivo' },
  ];

  nuevoUsuario: any = {
    nombre: ''
  };

  formulario: FormGroup;
  mostrarAdvertenciaContrasena: boolean = false;
  campoContrasenaSeleccionado: boolean = false;
  modalRef: NgbModalRef | null = null;

  constructor(private modalService: NgbModal, private fb: FormBuilder) {
    this.formulario = this.fb.group({
      role: [''],
      nombre: ['', Validators.required], // Agregar el campo del nombre
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, this.validarContrasena]],
    });
  }


  openModal(content: any): void {
    this.modalRef = this.modalService.open(content);
  }


  closeModal(modal: any): void {
    modal.dismiss();
  }

  sendMessage(): void {
    // Agrega aquí la lógica para enviar el mensaje
    console.log('Mensaje enviado');
  }

  validarContrasena(control: any) {
    // Lógica para validar la contraseña
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
    this.formulario.reset(); // Limpia los campos del formulario
    this.formulario.get('role')?.setValue(null); // Reinicia la selección de rol a null
    this.mostrarAdvertenciaContrasena = false; // Oculta el mensaje de advertencia de contraseña
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

        // Lógica para verificar si se cumplen los requisitos y actualizar mostrarAdvertenciaContrasena
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
    this.validarFormulario(); // Llamar a la función de validación
    if (!this.mostrarAvisoGeneral) {
        this.sendMessage();
        this.closeModal(modal);
    }
}


agregarUsuario() {
  if (this.formulario.valid) {
    this.nuevoUsuario.Estatus = 'Activo'; // Establece el estatus en 'Activo'
    this.empleados.push(this.nuevoUsuario);
    this.nuevoUsuario = {}; // Limpia el objeto para futuros usos
  }
}

agregarUsuarioYCerrarModal() {
  if (this.formulario.valid) {
    const nuevoUsuario = {
      Rol: this.formulario.get('role')?.value,
      nombre: this.nuevoUsuario.nombre, // Asegúrate de tener el valor del nombre
      Correo: this.formulario.get('email')?.value,
      Estatus: 'Activo' // Puedes establecer un valor predeterminado si lo deseas
    };

    this.empleados.push(nuevoUsuario);

    if (this.modalRef) {
      this.modalRef.close(); // Cerrar el modal usando la referencia
    }
  } else {
    this.mostrarAvisoGeneral = true;
  }
}


}
