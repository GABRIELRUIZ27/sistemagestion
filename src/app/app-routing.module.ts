import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { AdministradorComponent } from './administrador/administrador.component'; // Ajusta la ruta según tu estructura

const routes: Routes = [
  { path: 'inicio', component: InicioComponent },
  { path: 'administrador', component: AdministradorComponent }, // Nueva ruta para el componente "administrador"
  // Otras rutas...
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
