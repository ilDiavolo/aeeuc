import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/home/home.component'
import { InstitucionComponent } from './components/institucion/institucion.component'
import { CensoComponent } from './components/censo/censo.component'
import { CiclosComponent } from './components/ciclos/ciclos.component'
import { PlanComponent } from './components/plan/plan.component'


const routes: Routes = [
    
    { path: 'home', component: HomeComponent },
    { 
        path: 'institucion/:id_institucion', 
        component: InstitucionComponent
    },
    { 
        path: 'institucion/:id_institucion/:id_dependecia', 
        component: InstitucionComponent
    },
    { path: 'censo/:id_dependecia', component: CensoComponent },
    { path: 'plan/:id_dependecia', component: PlanComponent },
    { path: 'ciclos/:id_dependecia', component: CiclosComponent },
    { path: '**', pathMatch: 'full', redirectTo:'home' }

];

export const app_routing = RouterModule.forRoot(routes)