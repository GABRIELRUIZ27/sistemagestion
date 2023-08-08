import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-administrador',
  templateUrl: './administrador.component.html',
  styleUrls: ['./administrador.component.css']
})
export class AdministradorComponent {
  empleados = [
    { Rol: 'Usuario', Nombre: 'Juan Carlos Martínez García', Correo: 'correo@ejemplo.com', Estatus: 'Activo' },
    { Rol: 'Candidato', Nombre: 'Ana María Rodríguez López', Correo: 'correo@ejemplo.com',  Estatus: 'Inactivo' },
    { Rol: 'Candidato', Nombre: 'Carlos Eduardo Pérez Sánchez', Correo: 'correo@ejemplo.com', Estatus: 'Activo' },
    { Rol: 'Administrador', Nombre: 'María Fernanda González Ramírez', Correo: 'correo@ejemplo.com', Estatus: 'Inactivo' },
    { Rol: 'Usuario', Nombre: 'Alejandro Torres Jiménez', Correo: 'correo@ejemplo.com', Estatus: 'Activo' },
    { Rol: 'Uusuario', Nombre: 'Laura Isabel Castro Vargas', Correo: 'correo@ejemplo.com', Estatus: 'Inactivo' },
    { Rol: 'Candidato', Nombre: 'Javier Antonio Mendoza Cruz', Correo: 'correo@ejemplo.com', Estatus: 'Activo' },
    { Rol: 'Usuario', Nombre: '', Correo: 'correo@ejemplo.com', Estatus: 'Inactivo' },
  ];

  nuevoUsuario: any = {};

  formulario: FormGroup;
  mostrarAdvertenciaContrasena: boolean = false;

  constructor(private modalService: NgbModal, private fb: FormBuilder) {
    this.formulario = this.fb.group({
      role: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, this.validarContrasena]],
    });
  }

  openModal(content: any): void {
    this.modalService.open(content);
  }

  closeModal(modal: any): void {
    modal.dismiss();
  }

  sendMessage(): void {
    // Agrega aquí la lógica para enviar el mensaje
    console.log('Mensaje enviado');
  }

  sendMessageAndClose(modal: any): void {
    this.sendMessage();
    this.closeModal(modal);
  }

  agregarUsuario(): void {
    this.empleados.push(this.nuevoUsuario);
    this.nuevoUsuario = {}; // Limpiar el objeto para futuros usos

    const activeModal = this.modalService.open(null); // No necesitas una referencia al modal abierto
    activeModal.dismiss(); // Cerrar el modal
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

}
