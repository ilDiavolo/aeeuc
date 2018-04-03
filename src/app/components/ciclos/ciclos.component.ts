import { Component, OnInit } from '@angular/core';

// Clases
import { Dependencia } from '../../classes/dependencia';
import { Institucion } from '../../classes/institucion';
import { Ciclos } from '../../classes/ciclos';

// Services
import { InstitucionService } from '../../services/institucion.service';
import { DependenciaService } from '../../services/dependencia.service';

import { FormControl, FormGroup, FormArray, Validators, FormBuilder } from '@angular/forms'
import { Router, ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-ciclos',
  templateUrl: './ciclos.component.html',
  styleUrls: ['./ciclos.component.scss']
})

export class CiclosComponent implements OnInit {

  fomulario_data_clicos: FormGroup

  institucion_activa:Institucion=new Institucion('','','','','')
  dependencia_activa:Dependencia=new Dependencia( '', '' , '' , 0 , 0 , '' , '' , '' , [],[],[],[],[] )
  cicloData:Ciclos=new Ciclos(0,0,[],[])
  
  
  // Data para la grafica
  lineChartLabels=[]
  lineChartData = [{data: [] , label: 'Gráfica'}]
  
  // Data para el intervalo
  time1 = {hour: 0, minute: 0}
  time2 = {hour: 0, minute: 0}
    
  intervalo_de_etiquetas=[]
  
  successMessage=false
  verFormCiclos=false

  constructor(  
    private activatedRoute:ActivatedRoute, 
    private fb: FormBuilder,
    
    private dependenciaService:DependenciaService,
    private institucionService:InstitucionService ){   
    
    
    activatedRoute.params.subscribe(params=>{

      this.dependenciaService.getDependencia(params['id_dependecia']).subscribe((res:any)=>{        
        this.dependencia_activa = res.data        
        
        if(this.dependencia_activa.ciclo.inicio>-1){
          
          this.cicloData = this.dependencia_activa.ciclo          
          
          this.lineChartLabels = this.cicloData.invtervalo
          this.lineChartData[0].data = this.cicloData.valores
          
        }
        

        this.institucionService.getInstitucion(this.dependencia_activa.id_institucion).subscribe((res:any)=>{        
          this.institucion_activa = res.data
        })
      })      
    })
    
    
    this.fomulario_data_clicos = fb.group({
      fila: fb.array([])  
    })
    
  }

// ============================================================================================


ngOnInit() {
  window.scroll(0,0)
}

// ============================================================================================

crearIntervalo(){
  
  let vector = new FormArray([])
  
  let intervalo = new Set()
  
  let inicio = this.time1.hour
  let fin = this.time2.hour
  
  if(this.time1.minute>0){ inicio += 0.5 }
  if(this.time2.minute>0){ fin += 0.5 }
  
  if(fin===0){fin=24}
  
  if(inicio<=fin){
    
    this.verFormCiclos = true
    
    while ( inicio <= fin ) {      
      intervalo.add(inicio)
      inicio += 0.5
    }
    
    let arreglo = []
    
    // cambio lo .5 a .3 para que al pasar por el pipe lo coloque la hora como debe ser
    intervalo.forEach(v=>{        
      if (v%1 > 0) {
        arreglo.push( Math.trunc(v)+0.3)
      }else{
        arreglo.push( v)
      }  
    })
    
    // Agrego los formController del array y seteo la data que tenga correspondecia con 
    // alguna etiqueta
    arreglo.forEach(v=>{        
      let aux = this.lineChartLabels.findIndex(val=>{
        return val==v
      })
      
      if( aux >= 0){
        vector.push(
          new FormControl(this.lineChartData[0].data[aux])
        )
      }else{
        
        vector.push(
          new FormControl(0)
        )
      }
    })
    
    this.lineChartData[0].data = vector.value    
    
    this.fomulario_data_clicos.controls['fila'] = vector
    
    this.intervalo_de_etiquetas = arreglo
    
    this.lineChartLabels = this.intervalo_de_etiquetas
    
  }else{
    this.verFormCiclos = false
  }
}

// ============================================================================================

guardarGrafica(){
  
  
  let values = (<FormArray> this.fomulario_data_clicos.get('fila') ).value
  
  
  this.cicloData.inicio = this.intervalo_de_etiquetas[0]
  this.cicloData.fin = this.intervalo_de_etiquetas[this.intervalo_de_etiquetas.length-1]
  
  this.cicloData.valores = values
  this.cicloData.invtervalo = this.intervalo_de_etiquetas
  
  this.dependencia_activa.ciclo = this.cicloData  
  this.dependenciaService.updateCiclo(this.dependencia_activa).subscribe(res=>{
    
  })
  
  
  this.lineChartLabels = this.intervalo_de_etiquetas
  this.actualizar(values)
  
  // mostrar mensaje de exito
  this.successMessage = true
  setTimeout(() => {
    this.successMessage = false
  }, 3000)
  
}

// ============================================================================================

public actualizar(vector):void{
  
  let _lineChartData:Array<any> = new Array(1)
  
  for (let i = 0; i < this.lineChartData.length; i++) {
    _lineChartData[i] = {data: new Array(vector.length), label: this.lineChartData[i].label};
    
    for (let j = 0; j < vector.length; j++) {
      _lineChartData[i].data[j] = vector[j] ;
    }
    
  }
  
  this.lineChartData = _lineChartData;  
  
}

// ============================================================================================


public leerArchivo(e) {
  
  var file: File = e.files[0]

  let info
  let inicio, fin
  let data = []

  var myReader:FileReader = new FileReader();

  myReader.onloadend = ()=>{
    info = myReader.result.split(/\r\n|\r|\n/g)
    
    info.map(elemt=>{
      if(elemt!==''){
        data.push(elemt)
      }
    })
    
    
    data = data.slice(2,data.length)
        
    inicio = info[0]    
    inicio = inicio.split(':')
    if(parseInt(inicio[1])===30){ 
      inicio = parseInt(inicio[0]) + 0.5
    }else{ inicio = parseInt(inicio[0]) }
    
    fin = info[1]
    fin = fin.split(':')  
    if(parseInt(fin[1])===30){ 
      fin = parseInt(fin[0]) + 0.5
    }else{ fin = parseInt(fin[0]) }
    

    if(fin===0){fin=24}

    // console.log('incio = ', inicio)
    // console.log('fin = ', fin)

    if(inicio<=fin){

      let vector = new FormArray([])  
      let intervalo = new Set()
    
      this.verFormCiclos = true
      
      while ( inicio <= fin ) {      
        intervalo.add(inicio)
        inicio += 0.5
      }
      
      let arreglo = []
      
      // cambio lo .5 a .3 para que al pasar por el pipe lo coloque la hora como debe ser
      intervalo.forEach(v=>{        
        if (v%1 > 0) {
          arreglo.push( Math.trunc(v)+0.3)
        }else{
          arreglo.push( v)
        }  
      })
      
      // Agrego los formController del array y seteo la data que tenga correspondecia con 
      // alguna etiqueta
      arreglo.forEach((v,index)=>{         
     
        // console.log(index,v, data[index])
          
        vector.push(
          new FormControl(data[index])
        )       

      })
      
      this.lineChartData[0].data = vector.value    
      
      this.fomulario_data_clicos.controls['fila'] = vector
      
      this.intervalo_de_etiquetas = arreglo
      
      this.lineChartLabels = this.intervalo_de_etiquetas
      
    }else{
      this.verFormCiclos = false
    }


  }
  

  if(file){

    myReader.readAsText(file)
  }else{
    console.log('fichero vacio')
  } 
  
}

fileChangeEvent(e){
  var file: File = e.files[0]
  document.getElementById('customFileLabel').innerHTML = file.name
}

resetLabelFile(){
  document.getElementById('customFileLabel').innerHTML = 'Seleccione un Archivo'
}


}

