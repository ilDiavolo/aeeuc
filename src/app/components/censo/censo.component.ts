import { Component, OnInit, ViewChild } from '@angular/core';

import { FormControl, FormGroup, FormArray, Validators, FormBuilder } from '@angular/forms'

import { Router, ActivatedRoute } from '@angular/router'

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TipoCarga } from '../../classes/tipo-carga';

// Services
import { InstitucionService } from '../../services/institucion.service';
import { DependenciaService } from '../../services/dependencia.service';
import { TipoCargaService } from '../../services/tipo-carga.service'

// Clases
import { Dependencia } from '../../classes/dependencia';
import { Institucion } from '../../classes/institucion';


@Component({
  selector: 'app-censo',
  templateUrl: './censo.component.html',
  styleUrls: ['./censo.component.scss']
})
export class CensoComponent implements OnInit {
  
  // ===========================  DATA DE ENTRADA QUE DEBO CARGAR  ============================
  
  // 1.- Data deL Censo
  institucion_activa:Institucion=new Institucion('','','','','')
  dependencia_activa:Dependencia=new Dependencia( '', '' , '' , 0 , 0 , '' , '' , '' , [],[],[],[],[] )

  
  // 2.- Data de los Select
  tipoCarga:TipoCarga[]=[]
  
  
  // ===========================  VARIABLES DE CONTROL  ============================

  
  // 3.- Controlar la data de los segundos select 
  matrix=[[]] 
  
  // 4.- Data del Censo 
  censoDeCarga:FormGroup
  vector:any
  
  // Nueva Carga
  newCarga:FormGroup

  // modal
  modal:NgbModalRef

  // totalizadores del censo
  total_cargas_conectadas=0
  total_wh_por_semanas=0

  successMessage=false
  
    
  
  // ============================================================================================
  
  constructor(  
    private router:Router, private activatedRoute:ActivatedRoute, 
    private modalService: NgbModal, private fb: FormBuilder,
    private tipoCargaService:TipoCargaService,
    private dependenciaService:DependenciaService,
    private institucionService:InstitucionService ){   
    
    
    activatedRoute.params.subscribe(params=>{

      this.dependenciaService.getDependencia(params['id_dependecia']).subscribe((res:any)=>{        
        this.dependencia_activa = res.data
        
        tipoCargaService.getCargas().subscribe((res:any)=>{
          this.tipoCarga = res.data
    
          // Esta instruccion carga la data de los segundos select
          for (let i = 0; i < this.dependencia_activa.censo.length; i++) {   
            for (let j = 0; j < this.tipoCarga.length; j++) {
              if (this.tipoCarga[j].categoria===this.dependencia_activa.censo[i].categoria) {
                this.matrix[i] = this.tipoCarga[j].items
              }        
            }
          }
    
        })
        
        // console.log(this.censo)

        this.institucionService.getInstitucion(this.dependencia_activa.id_institucion).subscribe((res:any)=>{        
          this.institucion_activa = res.data
        })
      })      
    })
    
    
// ============================================================================================

    this.newCarga = fb.group({
      tipo:['', Validators.required],
      nombre:['', Validators.required]
    })        

// ============================================================================================

    this.censoDeCarga = fb.group({
      fila: fb.array([])
    })
    // this.censoDeCarga = new FormGroup({
    //   'fila': new FormArray([])
    // })


  }



  ngOnInit() {    

    window.scroll(0,0)
    
    this.activatedRoute.params.subscribe(params=>{

      this.dependenciaService.getDependencia(params['id_dependecia']).subscribe((res:any)=>{        
        this.dependencia_activa = res.data

        // Esta funcion carga la data del censo
        this.dependencia_activa.censo.forEach( (element:any) => {
          
          (<FormArray>this.censoDeCarga.controls['fila']).controls.push(

            new FormGroup({
              'categoria': new FormControl(element.categoria, [
                Validators.required,
                this.noVacio
              ]),
              'nombre': new FormControl(element.nombre, [
                Validators.required,
                this.noVacio
              ]),
              'numero': new FormControl(element.numero, Validators.min(1)),
              'potencia': new FormControl(element.potencia),
              'fd': new FormControl(element.fd, [ Validators.min(0), Validators.max(1) ]),
              'horasDia': new FormControl(element.horasDia, [ Validators.min(1), Validators.max(24) ]),
              'diaSemana': new FormControl(element.diaSemana, [ Validators.min(1), Validators.max(7) ])
            })
          )

        })

        // Calculo de totales del censo
        this.actTotales()

      })
    })    
    

  }

  

  // Validaciones -------------------------

  noVacio( control: FormControl) : { [s:string]:boolean } {
    if (control.value === "" ) {
      return { novacio:true }
    }
    return null
  }


  // ---------------------------------------
  addCarga(){

    (<FormArray>this.censoDeCarga.controls['fila']).controls.push(
      new FormGroup({
        'categoria': new FormControl("", [
          Validators.required,
          this.noVacio
        ]),
        'nombre': new FormControl("", [
          Validators.required,
          this.noVacio
        ]),
        'numero': new FormControl(1, Validators.min(1)),
        'potencia': new FormControl(1),
        'fd': new FormControl(1, [ Validators.min(0), Validators.max(1) ]),
        'horasDia': new FormControl(1, [ Validators.min(1), Validators.max(24) ]),
        'diaSemana': new FormControl(1, [ Validators.min(1), Validators.max(7) ])
      })
    )

    this.actTotales()
  }

  eliminarCarga(id){

    (<FormArray>this.censoDeCarga.controls['fila']).controls.splice(id,1)
    this.matrix.splice(id,1)
    this.actTotales()
  }

 

  cambio(e:number){

    this.matrix[e] = []

    this.censoDeCarga.get('fila').get(`${e}`).get('nombre').reset('')
    let val = this.censoDeCarga.get('fila').get(`${e}`).value.categoria
    
    for (let i = 0; i < this.tipoCarga.length; i++) {
     
      if (this.tipoCarga[i].categoria === val  ) {
        this.matrix[e] = this.tipoCarga[i].items
      }
      
    }
  } 

  // Actualiza los totales del resultado del censo
  actTotales(){
    
    // =====================================================================================
    this.total_cargas_conectadas=0
    this.total_wh_por_semanas=0  
    
    this.vector = (<FormArray>this.censoDeCarga.controls['fila']).controls

    this.vector.forEach((formGrupo:FormGroup, index)=>{
      
      this.total_cargas_conectadas = ( formGrupo.controls['numero'].value * formGrupo.controls['potencia'].value ) + this.total_cargas_conectadas
      
      this.total_wh_por_semanas = ( 
        formGrupo.controls['numero'].value * 
        formGrupo.controls['potencia'].value * 
        formGrupo.controls['fd'].value * 
        formGrupo.controls['horasDia'].value * 
        formGrupo.controls['diaSemana'].value ) + this.total_wh_por_semanas
      })      
    // ======================================================================================

  }

  abrirModal(content){     
    // this.modal = this.modalService.open(newUserModal, { backdrop:'static' , keyboard:false, size: 'lg'} )
    this.modal = this.modalService.open(content, { backdrop:'static' , keyboard:false, windowClass:'newUser-modal', size:'sm'} )
  }

  

  guardarNewCarga(){
    //verifico que sea valido el formulario
    if (this.newCarga.valid) {
      // busco el indice de la categoria
      let index = this.tipoCarga.findIndex((e)=>{
        return e.categoria === this.newCarga.value.tipo
      })

      // busco el indice del elemento en items
      let j = this.tipoCarga[index].items.findIndex(e=>{
        return e === this.newCarga.value.nombre
      })

      //pregunto si el elemento ya existe
      if (j>-1) {
        
        console.log('la carga ya se encuentra')
        console.log(this.tipoCarga[index].items[j])

      } else {

        this.tipoCarga[index].items.push(this.newCarga.value.nombre)
        let c:TipoCarga= new TipoCarga(
          this.newCarga.value.tipo,
          this.tipoCarga[index].items
        )

        this.tipoCargaService.agregarCarga(c).subscribe(data=>{
          // console.log(data)
        })             

      }
      
      this.modal.close()
    }

    
  }



  guardarCambios(){

    let isValid=true
    let filas = (<FormArray>this.censoDeCarga.controls['fila']).controls

    let dataCenso=[]

    filas.forEach((formGrupo:FormGroup) => { 
      
      if(formGrupo.valid){
        dataCenso.push(formGrupo.value)        
      }else{
        isValid = formGrupo.valid
      } 

    })
    
    if(isValid) {   

      let indicadores_LBE = [0, 0, 0, 0, 0, 0, 0]

      dataCenso.forEach(carga => {

        let cargaValue = carga.numero * carga.potencia * carga.fd * carga.horasDia * carga.diaSemana 
        // cargaValue = (cargaValue*4.3)/1000

        if(carga.categoria === 'Iluminación'){ indicadores_LBE[0] = indicadores_LBE[0] + cargaValue }
        if(carga.categoria === 'Climatización'){ indicadores_LBE[1] = indicadores_LBE[1] + cargaValue }
        if(carga.categoria === 'Tecnología'){ indicadores_LBE[2] = indicadores_LBE[2] + cargaValue }
        if(carga.categoria === 'Laboratorio'){ indicadores_LBE[3] = indicadores_LBE[3] + cargaValue }
        if(carga.categoria === 'Elevación'){ indicadores_LBE[4] = indicadores_LBE[4] + cargaValue }
        if(carga.categoria === 'Cosina'){ indicadores_LBE[5] = indicadores_LBE[5] + cargaValue }
        if(carga.categoria === 'Otros'){ indicadores_LBE[6] = indicadores_LBE[6] + cargaValue }
      });

      indicadores_LBE.forEach((element,index) => {
        indicadores_LBE[index] = ((element*4.3)/1000)/this.dependencia_activa.area_util
      });

      // console.log('================= ACTIVA PLUS ==================')      
      this.dependencia_activa.censo = dataCenso
      this.dependencia_activa.plan = dataCenso
      this.dependencia_activa.lbe = indicadores_LBE
      // console.log(this.dependencia_activa.censo)

      this.dependenciaService.updateCenso(this.dependencia_activa).subscribe((res:any)=>{
        // console.log(res)
      })

      // mostrar mensaje de exito
      this.successMessage = true
      setTimeout(() => {
        this.successMessage = false
      }, 3000)
      
    } else {
      console.log( 'el formulario es invalido' )      
      
    }    

  }







}
