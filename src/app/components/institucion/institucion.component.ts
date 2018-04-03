import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


import { Dependencia } from '../../classes/dependencia';
import { Institucion } from '../../classes/institucion';
import { Factura } from '../../classes/factura';

import { DependenciaService } from '../../services/dependencia.service';
import { InstitucionService } from '../../services/institucion.service';
import { FacturadoService } from '../../services/facturado.service';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-institucion',
  templateUrl: './institucion.component.html',
  styleUrls: ['./institucion.component.scss']
})
export class InstitucionComponent implements OnInit {


  institucion_activa:Institucion=new Institucion('','','','','')
  dependencia_activa:Dependencia=new Dependencia( '', '' , '' , 0 , 0 , '' , '' , '' , [],[],[],[],[] )


  lista_dependencias:Dependencia[]=[]

  // formgroup nueva dependencia
  fomulario_nueva_dependencia: FormGroup
  fomulario_agregar_factura: FormGroup

  // modales
  modal_nueva_dependencia:NgbModalRef
  modal_agregar_factura:NgbModalRef
  modal_confirm_delete_factura:NgbModalRef
  modal_confirm_delete_dependencia:NgbModalRef

  // ============================= GRAFICA DE BARRAS =======================================
  
  public barChartLabels:string[] = ['Iluminación', 'Climatización', 'Tecnología',
  'Laboratorio', 'Elevación', 'Cosina', 'Otros']
  public barCharDataRef = [1, 1, 1, 1, 1, 1, 1]  

  public barChartData:any[] = [
    {data: [], label: 'Series A'},
    {data: [], label: 'Series B'}
  ];

  public barChartOptions:any = {  responsive: true }
  public barChartType:string = 'bar'
  public barChartLegend:boolean = true


  // ============================= MODELO DE DATOS =======================================
  
  //==================================== VARIABLES DE CONTROL =================================

  editar_factura:boolean=false
  pos = -1

  total_cargas_conectadas=0
  total_wh_por_semanas=0
  
  total_cargas_conectadas_plan=0
  total_wh_por_semanas_plan=0


  lineChartLabels = []
  lineaCharData = [{data: [], label: 'Gráfica'}]



  // ==========================================================================================

  constructor( 
    
    private activatedRoute:ActivatedRoute, 
    private router:Router,
    private modalService: NgbModal, 
    private fb: FormBuilder,
    private dependenciaService:DependenciaService,
    private institucionService:InstitucionService,
    private facturadoService:FacturadoService ){

    this.fomulario_nueva_dependencia = fb.group({
      nombre:             ['', Validators.required],
      area_util:          ['', Validators.required],
      area_bruta:         ['', Validators.required],
      compania_electrica: ['', Validators.required],
      nic:                ['', Validators.required],
      numero_medidor:     ['', Validators.required]
    })

    this.fomulario_agregar_factura = fb.group({
      fecha :           ['', Validators.required],
      numero_factura :  ['', Validators.required],
      kwh :             [ Validators.required ],
      kva :             [ Validators.required ],
      tarifa :          [ Validators.required ],
      monto :           [ Validators.required ],
    })

  }

  ngOnInit() {
    
    this.activatedRoute.params.subscribe(params=>{
      
      this.institucionService.getInstitucion(params['id_institucion']).subscribe((res:any)=>{
        this.institucion_activa = res.data
      })

      this.dependenciaService.allDependencia(params['id_institucion']).subscribe((res:any)=>{
        this.lista_dependencias = res.data

        if(params['id_dependecia']){
          // console.log('entre desde censo')
          this.verDependencia(params['id_dependecia'])

        }else{
          // console.log('entre desde home')
          if(this.lista_dependencias.length>0){
            this.verDependencia(this.lista_dependencias[0]._id)          
          }
        }
        
      })

    })    
    
    
  }

  // events
  public chartClicked(e:any):void {
    console.log(e);
  }
 
  public chartHovered(e:any):void {
    console.log(e);
  }


  ir(el:HTMLElement){
    el.scrollIntoView({behavior: "smooth", block: "start", inline: "start" })
  }

  // ================================================================================
  
  verDependencia(id:string){
    this.dependenciaService.getDependencia(id).subscribe((res:any)=>{
      this.dependencia_activa = res.data
      
      // Calculo de totales del censo
      if (this.dependencia_activa.censo.length > 0  ) {
        
        this.total_cargas_conectadas=0
        this.total_wh_por_semanas=0    
        
        this.total_cargas_conectadas_plan=0
        this.total_wh_por_semanas_plan=0
        
        // ================================================================================
        let dataRef = [] 

        this.dependencia_activa.lbe.forEach((element, index) => {
          
          if (element>0) {            
            dataRef.push(this.barCharDataRef[index])            
          }else{
            dataRef.push(0)
          }
        });
        let newBarData = [
          {data: this.dependencia_activa.lbe, label: 'LBE'},
          {data: dataRef, label: 'LBE Referencia'}
        ]        
               
        this.barChartData = newBarData
       
        // ================================================================================        
        
        this.dependencia_activa.censo.forEach(carga=>{
          this.total_cargas_conectadas = ( carga.numero * carga.potencia ) + this.total_cargas_conectadas
          this.total_wh_por_semanas = ( carga.numero * carga.fd * carga.horasDia * carga.diaSemana * carga.potencia) + this.total_wh_por_semanas                    
        })

        this.dependencia_activa.plan.forEach(carga=>{
          this.total_cargas_conectadas_plan = ( carga.numero * carga.potencia ) + this.total_cargas_conectadas_plan
          this.total_wh_por_semanas_plan = ( carga.numero * carga.fd * carga.horasDia * carga.diaSemana * carga.potencia) + this.total_wh_por_semanas_plan                    
        })



      }else{

        this.total_cargas_conectadas=0
        this.total_wh_por_semanas=0    
        
        this.total_cargas_conectadas_plan=0
        this.total_wh_por_semanas_plan=0

        this.barChartData =  [
          {data: [], label: 'LBE'},
          {data: [], label: 'LBE Referencia'}
        ]
      }
      
      // Ciclos de Carga Grafica
      let label = []
      this.dependencia_activa.ciclo.invtervalo.forEach(element => {

        let horas = Math.trunc(element)
        let minutos:any = '00'
        if( (element%1)>0 ){ minutos=30 }
        label.push(`${horas}:${minutos}`) 
      })
      // console.log(label)
      this.lineChartLabels = label
      this.lineaCharData[0].data = this.dependencia_activa.ciclo.valores
            
    })

  }


  // ================================================================================
  
  open_agregar_factura(content){     
    // this.modal = this.modalService.open(newUserModal, { backdrop:'static' , keyboard:false, size: 'lg'} )
    this.modal_agregar_factura = this.modalService.open(
      content, { backdrop:'static' , keyboard:false, windowClass:'newUser-modal'} 
    )
  }
  
  open_agregar_dependencia(content){     
    // this.modal = this.modalService.open(newUserModal, { backdrop:'static' , keyboard:false, size: 'lg'} )
    this.modal_nueva_dependencia = this.modalService.open(
      content, { backdrop:'static' , keyboard:false, windowClass:'newUser-modal'} 
    )
  }
  
  // ================================================================================

  submitFactura(){

    if(this.fomulario_agregar_factura.valid){

      let newFactura:Factura = this.fomulario_agregar_factura.value

      this.dependencia_activa.facturado.push(newFactura)

      this.facturadoService.addFactura(this.dependencia_activa).subscribe(res=>{      
        console.log(res)
      })

    }
    
    this.modal_agregar_factura.close()

  }

  submitDependencia(){

    let value = this.fomulario_nueva_dependencia.value  
    
    // isValid form
    if (this.fomulario_nueva_dependencia.valid) {

      let newDependencia:Dependencia = new Dependencia(
        '', 
        this.institucion_activa._id,
        value.nombre,
        value.area_util,
        value.area_bruta,
        value.compania_electrica,
        value.nic,
        value.numero_medidor,        
        [],[],[],[],[]
      )

      this.dependenciaService.addDependencia(newDependencia).subscribe(res=>{
        this.lista_dependencias.push(res.data)
      })
    }
    
    this.fomulario_nueva_dependencia.reset()

    this.modal_nueva_dependencia.close()

  }

  open_confirm_delete_factura(content, value){
    this.pos = value     
    // this.modal = this.modalService.open(newUserModal, { backdrop:'static' , keyboard:false, size: 'lg'} )
    this.modal_confirm_delete_factura = this.modalService.open(
      content, { backdrop:'static' , keyboard:false, windowClass:'confirmDelete'} 
    )
  }
  
  eliminarFactura(){
    
    this.modal_confirm_delete_factura.close()
    // console.log(this.pos)
    

    this.dependencia_activa.facturado.splice(this.pos,1)

    this.facturadoService.eliminarFactura(this.dependencia_activa).subscribe(res=>{      
      console.log(res)
    })


    this.pos = -1

  }

  open_confirm_delete_dependencia(content){    
    this.modal_confirm_delete_dependencia = this.modalService.open(
      content, { backdrop:'static' , keyboard:false, windowClass:'confirmDelete'} 
    )
  }

  eliminarDependencia(){

    // REVISAR ESTO PARA DARLE UNA MEJOR SOLUCION! ESTA ESTÁ MUY 
    // PARCHEADA !!!!!!!


    this.dependenciaService.killDependencia(this.dependencia_activa._id).subscribe(res=>{
      console.log(res)

    })
    this.modal_confirm_delete_dependencia.close()

    history.pushState(null,'',`/institucion/${this.dependencia_activa.id_institucion}`)

    // this.router.navigate(['/institucion', this.dependencia_activa.id_institucion ])
    location.reload()
  }


}
