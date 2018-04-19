import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { UsuarioService } from '../services/usuario.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private usuarioService:UsuarioService){}

  canActivate(    
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

      if(sessionStorage.getItem('token')){

        return this.usuarioService.accessValid().map(inf=>{
          
          if(inf.auth){

            return true

          }else{
            sessionStorage.removeItem('token')
            this.router.navigate(['/home'])
            return false
          }

        })


      }else{
        console.log('Nisiquiera tienes token...')
        this.router.navigate(['/home'])
        return false
      }
  }
}
