import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/home/home.component'
import { InstitucionComponent } from './components/institucion/institucion.component'
import { CensoComponent } from './components/censo/censo.component'
import { CiclosComponent } from './components/ciclos/ciclos.component'
import { PlanComponent } from './components/plan/plan.component'

import { AcercaDeComponent } from './components/acerca-de/acerca-de.component'
import { LbeComponent } from './components/lbe/lbe.component'
import { AdminComponent } from './components/admin/admin.component'

import { AuthGuard } from './guard/auth.guard'

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
    { path: 'censo/:id_dependecia', component: CensoComponent, canActivate: [AuthGuard] },
    { path: 'plan/:id_dependecia', component: PlanComponent, canActivate: [AuthGuard] },
    { path: 'ciclos/:id_dependecia', component: CiclosComponent, canActivate: [AuthGuard] },

    { path: 'lbe', component: LbeComponent  },
    { path: 'acerca-de', component: AcercaDeComponent  },
    { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },

    { path: '**', pathMatch: 'full', redirectTo:'home' }

];

export const app_routing = RouterModule.forRoot(routes)