import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { Institucion } from '../../classes/institucion';

import { InstitucionService } from '../../services/institucion.service';
import { DependenciaService } from '../../services/dependencia.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  instituciones:Institucion[]=[]

  // modal
  modal:NgbModalRef

  // formGroup
  formInstitucion:FormGroup

  constructor(
    private router:Router,
    private modalService: NgbModal, 
    private fb: FormBuilder, 
    private institucionService:InstitucionService, 
    private dependenciaService:DependenciaService ){ 

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


  

}




