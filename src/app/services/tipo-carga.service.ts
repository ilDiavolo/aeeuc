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

  url
  url_prd = 'https://aeeuc2018backend.herokuapp.com'
  url_dev = 'http://localhost:5000'

  constructor(private httpClient:HttpClient ) { 
    this.url=this.url_dev
  }

  public getCargas(): Observable<TipoCarga[]>{
    return this.httpClient.get<TipoCarga[]>(this.url+'/typeCarga')
    .catch(e=>{
      return Observable.of(e)
    })
  }

  public agregarCarga(e:TipoCarga):Observable<TipoCarga>{
    return this.httpClient.post<TipoCarga>(this.url+'/typeCarga',e)
    .catch(e=>{
      return Observable.of(e)
    })
  }

}
