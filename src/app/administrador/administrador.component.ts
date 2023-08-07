import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-administrador',
  templateUrl: './administrador.component.html',
  styleUrls: ['./administrador.component.css']
})
export class AdministradorComponent {

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
}
