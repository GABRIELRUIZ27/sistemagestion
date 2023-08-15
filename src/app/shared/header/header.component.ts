import { Component } from '@angular/core';
import { Router, ActivatedRoute  } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(private router: Router, private route: ActivatedRoute) {}

  cerrarSesion() {
    this.router.navigate(['/login']);
  }

  esSeleccionado(ruta: string): boolean {
    return this.route.snapshot.url.join('/') === ruta;
  }
}
