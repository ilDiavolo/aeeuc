import { Component, OnInit } from '@angular/core';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../classes/usuario';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {


  userActive=''

  listUser: Array<Usuario>=[] 

  form_agregar_usuario: FormGroup

  modal:NgbModalRef

  loading
  error=''
  pos

  constructor( 
    private fb:FormBuilder,
    private usuarioService:UsuarioService, 
    private modalService: NgbModal) { 

      usuarioService.chekUser().subscribe(inf=>{        
        if(inf.auth){
          this.userActive = inf.user.nombre
        }else{
          console.log('no hay un usuario activo')
          this.userActive= ''
        }
      })
 
    }

  ngOnInit() {
    this.usuarioService.getAllUser().subscribe(vector=>{     
      this.listUser = vector.usuarios
    })
  }

  goBack(){
    history.back()
  }

  crearUsuario(){
    
    this.loading=true
    
    if (this.form_agregar_usuario.valid) {

      let val = this.form_agregar_usuario.value

      this.usuarioService.getUser(val.email).subscribe((res:any)=>{
        
        if (!res.usuario) {
          
          if (val.password === val.passconfirm) {
            
            let user:Usuario= new Usuario('',val.email, val.nombre, val.password)

            this.usuarioService.createUser(user).subscribe( data =>{
              if(data.datares){
                this.listUser.push(user)
                this.modal.close()
              }
            })
        
          }else{ alert('Las contraseñas deben coincidir') }
          
        }else{ alert('El usuario ya se encuentra registrado') }
      })   
            
    }
        
    this.loading=false
  }

  nuevoUsuario(newUserModal){
        
    this.form_agregar_usuario = this.fb.group({
      email: ['',  [Validators.email ,Validators.required ] ],
      nombre: ['', Validators.required ],
      password: ['', [Validators.required, Validators.pattern('((?=.*[0-9])|(?=.*\W+)|(?=.*[A-Z]))(?=.*[a-z]).{5,}')] ],
      passconfirm: ['', [Validators.required, Validators.pattern('((?=.*[0-9])|(?=.*\W+)|(?=.*[A-Z]))(?=.*[a-z]).{5,}')] ]
    })
            
    // this.modal = this.modalService.open(newUserModal, { backdrop:'static' , keyboard:false, size: 'lg'} )
    this.modal = this.modalService.open(newUserModal, { backdrop:'static' , keyboard:false} )
  }


  editaUsuarioOpenModal(template, user, i){

    this.pos=i

    this.form_agregar_usuario = this.fb.group({
      email: [user.email ,  [Validators.email ,Validators.required ] ],
      nombre: [user.nombre, Validators.required ],
      id:[user._id]
    })
            
    // this.modal = this.modalService.open(newUserModal, { backdrop:'static' , keyboard:false, size: 'lg'} )
    this.modal = this.modalService.open(template, { backdrop:'static' , keyboard:false} )

  }

  editarUsuario(){

    this.loading=true
    
    if (this.form_agregar_usuario.valid) {

      let val = this.form_agregar_usuario.value
      let user:Usuario=new Usuario(val.id,val.email,val.nombre,'')

      this.usuarioService.updateUser(user).subscribe( res=>{
        alert('Mensaje: '+res.message)
        this.listUser[this.pos]=user
        this.modal.close()
        location.reload()
      })
            
    }
        
    this.loading=false

  }


  cambiarPassOpenModal(template, user){
    this.form_agregar_usuario = this.fb.group({
      password: ['', [Validators.required, Validators.pattern('((?=.*[0-9])|(?=.*\W+)|(?=.*[A-Z]))(?=.*[a-z]).{5,}')] ],
      passconfirm: ['', [Validators.required, Validators.pattern('((?=.*[0-9])|(?=.*\W+)|(?=.*[A-Z]))(?=.*[a-z]).{5,}')] ],
      id:[user._id]
    })
            
    // this.modal = this.modalService.open(newUserModal, { backdrop:'static' , keyboard:false, size: 'lg'} )
    this.modal = this.modalService.open(template, { backdrop:'static' , keyboard:false} )
  }

  cambiarPass(){   

    this.loading=true
    
    if (this.form_agregar_usuario.valid) {

      let val = this.form_agregar_usuario.value

      if(val.password === val.passconfirm){

        let user:Usuario=new Usuario(val.id,'','',val.password)
  
        this.usuarioService.updatePass(user).subscribe(res=>{
          this.modal.close()
          alert('Mensaje: '+res.message) 
        })

      }else{
        alert('Las contraseñas deben coincidir')
      }
            
    }else{  alert('Las contraseñas no posee el formato indicado')}
        
    this.loading=false        
     
  }

  eliminarUsuarioOpenModal(template, i){    
    this.pos = i            
    // this.modal = this.modalService.open(newUserModal, { backdrop:'static' , keyboard:false, size: 'lg'} )
    this.modal = this.modalService.open(template, { backdrop:'static' , keyboard:false,  windowClass:'confirmDelete'} )
  }


  eliminarUsuario(){

    let user = this.listUser[this.pos]

    this.usuarioService.deleteUser(user).subscribe(res=>{
      
      this.modal.close()
      this.listUser.splice(this.pos,1)
      alert(`el usuario ${user.nombre} fue eliminado correctamente`)
    })
  }

  session(useractive){
    this.userActive = useractive
  }
  

}
