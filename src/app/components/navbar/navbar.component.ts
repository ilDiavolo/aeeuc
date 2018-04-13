import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';

import { UsuarioService } from '../../services/usuario.service';
// import { Usuario } from '../../classes/usuario';

import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  // usuario:Usuario = new Usuario('','','','')
  @Output() enviarUserActive= new EventEmitter<any>();
  
  userActive=''

  site=''
  id_lv1=''
  id_lv2=''

  // ============================= INICIAR SESSION ====================
  form_login: FormGroup
  
  error:any = ''
  loading:boolean = false

  @ViewChild('p') public popover: NgbPopover;
  // ==================================================================

  constructor( 
    private usuarioService:UsuarioService, 
    private router:Router,
    private fb:FormBuilder ) { 
     
    if(sessionStorage.getItem('session')) { this.userActive = sessionStorage.getItem('session')}
     
  }

  ngOnInit() {
        
    let estoy_en:any = location.pathname
    estoy_en = estoy_en.split('/')    
    
    // let vengo_de:any   = localStorage.getItem('site')
    let vengo_de:any   = sessionStorage.getItem('site')
        
    if (!vengo_de) {
      // localStorage.setItem('site','/home')
      sessionStorage.setItem('site','/home')
      vengo_de = '/home'
    }   
    
    vengo_de = vengo_de.split('/')    

    if( (estoy_en[2]!=="lbe") && (estoy_en[2]!=="acerca-de") && 
        (estoy_en[2]!=="home") && (estoy_en[2]!=="admin") ){

      if (estoy_en[2]) {

        this.site = estoy_en[2]
        this.site = '/'+this.site
      
        if (estoy_en[3]) {
          this.id_lv1 = estoy_en[3]
  
          if (estoy_en[4]) {
            this.id_lv2 = estoy_en[4]

          }
        }
      }

      // localStorage.setItem('site', location.pathname)
      sessionStorage.setItem('site', location.pathname)

    }else{

      if (vengo_de[2]) {

        this.site = vengo_de[2]
        this.site = '/'+this.site
      
        if (vengo_de[3]) {
          this.id_lv1 = vengo_de[3]
  
          if (vengo_de[4]) {
            this.id_lv2 = vengo_de[4]

          }
        }
      }

    }

  }

  pop(){
    console.log(this.userActive)
    if(this.popover.isOpen()){
      this.popover.close()
    } else {

      this.form_login = this.fb.group({
        email: ['', Validators.email],
        pass:  ['', Validators.required]
      })
      this.popover.open()      
    }
  }


  login(){
    // console.log( this.form_login.value.email )
    let email = this.form_login.value.email
    let pass = this.form_login.value.pass
    
    this.usuarioService.login(email, pass).subscribe(result=>{

      if (result.nombre) {

        this.userActive = result.nombre
        this.enviarUserActive.emit(this.userActive)

        sessionStorage.setItem('session', this.userActive )       

        this.popover.close()
      } else {
        this.error = result
      }
    })

  }

  closeSession(){
    
    this.userActive = ''
    this.enviarUserActive.emit(this.userActive)
    sessionStorage.removeItem('session')

    let estoy_en:any = location.pathname
    estoy_en = estoy_en.split('/')

    if( (estoy_en[2]==='admin') || (estoy_en[2]==='ciclos') || 
        (estoy_en[2]==='plan') || (estoy_en[2]==='censo') ){


          this.router.navigate(['/home'])
    }
  }

}
