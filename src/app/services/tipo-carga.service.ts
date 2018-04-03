import { Injectable } from '@angular/core';

// import 'rxjs/add/observable/throw';
// import 'rxjs/add/operator/map';
// import '../../rxjs/index'

import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { TipoCarga } from '../classes/tipo-carga'

@Injectable()
export class TipoCargaService {

  url_prd = 'https://aeeuc2018backend.herokuapp.com'
  url_dev = 'http://localhost:5000'

  constructor(private httpClient:HttpClient ) { }

  public getCargas(): Observable<TipoCarga[]>{
    return this.httpClient.get<TipoCarga[]>('https://aeeuc2018backend.herokuapp.com/typeCarga')
    .catch(e=>{
      return Observable.of(e)
    })
  }

  public agregarCarga(e:TipoCarga):Observable<TipoCarga>{
    return this.httpClient.post<TipoCarga>('https://aeeuc2018backend.herokuapp.com/typeCarga',e)
    .catch(e=>{
      return Observable.of(e)
    })
  }

}
