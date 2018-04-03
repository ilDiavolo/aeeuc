import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  institution:{ 

    _id:'01', nombre:'Universidad de Carabobo', tipo:'Académica', rif:'j-12345678-9',
    descripcion:'La universidad de Carabobo es una instucion publica encagada de formar profecinales',

    dependencias:[
      {
        _id:'010',
        nombre:'Comedor', area_util: 23000, area_bruta: 24513,
        // fecha_creacion_censo: new Date('27-05-2018'),         
        facturado:{
          kwh:27000, kva:33000,
          tarifa:1300, monto:76000, // posiblemente el monto sea un dato que se pueda calcular          
          compañia_electica:'Coorpoelec', 
          numero_medidor:'ae87693', numero_factura:'00038762'
        },

        censo: [
          {categoria:'Climatización', carga:'Aire acondicionado de 18000 Btu',  numero:7,     potencia:1200, fd:'07', horasDia:'5',   diaSemana:'5'},
          {categoria:'Tecnología',    carga:'Televisor',                        numero:13,    potencia:300, fd:'07',  horasDia:'8',   diaSemana:'5'},
          {categoria:'Iluminación',   carga:'Bombillo fluorescente 13W',        numero:666,   potencia:75, fd:'07',   horasDia:'13',  diaSemana:'6'},
          {categoria:'Cosina',        carga:'Cafetera',                         numero:1024,  potencia:280, fd:'07',  horasDia:'8',   diaSemana:'7'}
        ],

        ciclo:{
          // Schema de Ciclo de Carga
        },

        lbe:{
          // Linea Base Energetica e Indicadores de Desempeño Energetico
        },

        plan:{
          // Posiblemente no hara falta
        }
      }
    ]
  }
  
  


}
