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
      Estatus: this.nuevoUsuario.Estatus // Usar el estatus seleccionado
    };

    this.empleados.push(nuevoUsuario);
    this.formulario.reset();
    this.nuevoUsuario = {};

    if (this.modalRef) {
      this.modalRef.close();
    }
  } else {
    this.mostrarAvisoGeneral = true;
  }
}


}
