import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { Institucion } from '../../classes/institucion';

import { InstitucionService } from '../../services/institucion.service';
import { DependenciaService } from '../../services/dependencia.service';
import { UsuarioService } from '../../services/usuario.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  instituciones:Institucion[]=[]
  tiposDeInstitucion = ['Educacional','De Salud','Económicas','Religiosas','Públicas','Sociales','De Caridad']

  // modal
  modal:NgbModalRef
  modal_confirm_delete_institucion:NgbModalRef

  // formGroup
  formInstitucion:FormGroup

  pos
  userActive=''

  constructor(

    private router:Router,
    private modalService: NgbModal, 
    private fb: FormBuilder, 
    private institucionService:InstitucionService, 
    private dependenciaService:DependenciaService,
    private usuarioService:UsuarioService ){  

      usuarioService.chekUser().subscribe(inf=>{        
        if(inf.auth){
          this.userActive = inf.user.nombre
        }else{
          console.log('no hay un usuario activo')
          this.userActive= ''
        }
      })
      
      this.formInstitucion = fb.group({        
        nombre:       ['', Validators.required],
        tipo:         ['', Validators.required],
        rif:          ['', Validators.required],
        descripcion:  ['', Validators.required]
      })
    }

  ngOnInit() {

    this.institucionService.allInstitucion().subscribe((res:any)=>{
      this.instituciones = res.data
    })

  }

  openModal(content){    
    this.formInstitucion = this.fb.group({        
      nombre:       ['', Validators.required],
      tipo:         ['', Validators.required],
      rif:          ['', Validators.required],
      descripcion:  ['', Validators.required]
    }) 
    // this.modal = this.modalService.open(newUserModal, { backdrop:'static' , keyboard:false, size: 'lg'} )
    this.modal = this.modalService.open(content, { backdrop:'static' , keyboard:false, windowClass:'newUser-modal'} )
  }
  addInstitucion(){

    if (this.formInstitucion.valid) {
      
      let inst:Institucion=new Institucion(
        '',      
        this.formInstitucion.value.nombre,
        this.formInstitucion.value.tipo,
        this.formInstitucion.value.rif,
        this.formInstitucion.value.descripcion
      )

      this.institucionService.agregarInstitucion(inst).subscribe(res=>{
        this.instituciones.push(res.data)
      })
    }

    this.modal.close()

  }

  open_confirm_delete_institution(content, value){
    this.pos = value     
    // this.modal = this.modalService.open(newUserModal, { backdrop:'static' , keyboard:false, size: 'lg'} )
    this.modal_confirm_delete_institucion = this.modalService.open(
      content, { backdrop:'static' , keyboard:false, windowClass:'confirmDelete'} 
    )
  }
  
  eliminarInstitucion(){
    
    this.modal_confirm_delete_institucion.close()
    
    this.institucionService.killInstitucion(this.instituciones[this.pos]._id).subscribe(res=>{
      console.log(res)
      this.instituciones.splice(this.pos,1)
    })
    

  }


  session(useractive){
    this.userActive = useractive
  }
  

}




