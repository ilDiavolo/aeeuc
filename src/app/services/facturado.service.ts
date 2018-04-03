import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Factura } from '../classes/factura';
import { Dependencia } from '../classes/dependencia';

@Injectable()
export class FacturadoService {

  url_prd = 'https://aeeuc2018backend.herokuapp.com'
  url_dev = 'http://localhost:5000'

  constructor( private httpClient:HttpClient) { }

  public addFactura(d:Dependencia): Observable<any>{
    return this.httpClient.post('https://aeeuc2018backend.herokuapp.com/factura', d )
    .catch(e=>{
      return Observable.of(e)
    })
  }

  public eliminarFactura(d:Dependencia): Observable<any>{
    return this.httpClient.put('https://aeeuc2018backend.herokuapp.com/factura', d)
    .catch(e=>{
      return Observable.of(e)
    })
  }

}
