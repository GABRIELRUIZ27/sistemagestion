import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-administrador',
  templateUrl: './administrador.component.html',
  styleUrls: ['./administrador.component.css']
})
export class AdministradorComponent {

  empleados = [
    { NoEmpleado: 123, Area: 'Recursos Humanos', Rol: 'Gerente', Estatus: 'Activo' },
    { NoEmpleado: 456, Area: 'Ventas', Rol: 'Vendedor', Estatus: 'Inactivo' },
    { NoEmpleado: 321, Area: 'Recursos Humanos', Rol: 'Gerente', Estatus: 'Activo' },
    { NoEmpleado: 654, Area: 'Ventas', Rol: 'Vendedor', Estatus: 'Inactivo' },
    { NoEmpleado: 987, Area: 'Recursos Humanos', Rol: 'Gerente', Estatus: 'Activo' },
    { NoEmpleado: 789, Area: 'Ventas', Rol: 'Vendedor', Estatus: 'Inactivo' },
    { NoEmpleado: 369, Area: 'Recursos Humanos', Rol: 'Gerente', Estatus: 'Activo' },
    { NoEmpleado: 147, Area: 'Ventas', Rol: 'Vendedor', Estatus: 'Inactivo' },
  ];

  nuevoUsuario: any = {};

  constructor(private modalService: NgbModal) {}

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


}

