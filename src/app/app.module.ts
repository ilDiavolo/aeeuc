import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';

// Cambiar fechas a español
import { registerLocaleData } from '@angular/common'
import localeES from '@angular/common/locales/es'
registerLocaleData(localeES, 'es')

// Chart.js
import { ChartsModule } from 'ng2-charts'

// Formularios
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

// Route
import { app_routing } from './app.routes'

// Servicios y Guard
import { TipoCargaService } from './services/tipo-carga.service'
import { InstitucionService } from './services/institucion.service'
import { DependenciaService } from './services/dependencia.service'
import { FacturadoService } from './services/facturado.service'
 
// HttpCliente
import { HttpClientModule } from '@angular/common/http'


import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { InstitucionComponent } from './components/institucion/institucion.component';
import { CensoComponent } from './components/censo/censo.component';
import { LineasComponent } from './components/graficas/lineas/lineas.component';
import { BarrasComponent } from './components/graficas/barras/barras.component';
import { CiclosComponent } from './components/ciclos/ciclos.component'
import { PlanComponent } from './components/plan/plan.component'


// ------------------------------------------------------
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'


// ------------------------------------------------------
// PIPES
import { HoraMilitarPipe } from './pipes/hora-militar.pipe'

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent, InstitucionComponent, CensoComponent, LineasComponent, BarrasComponent, CiclosComponent, HoraMilitarPipe, PlanComponent
  ],
  imports: [
    BrowserModule, app_routing, FormsModule, ChartsModule,
    ReactiveFormsModule, HttpClientModule, NgbModule.forRoot()
  ],
  providers: [
    {provide: LOCALE_ID, useValue:"es"}, TipoCargaService, InstitucionService, DependenciaService,
    FacturadoService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
