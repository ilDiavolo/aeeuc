import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Dependencia } from '../classes/dependencia';


@Injectable()
export class DependenciaService {

  url_prd = 'https://aeeuc2018backend.herokuapp.com'
  url_dev = 'http://localhost:5000'

  constructor( private httpClient:HttpClient ) { }
    

  public allDependencia(id:string):Observable<Dependencia[]>{
    return this.httpClient.get<Dependencia>('https://aeeuc2018backend.herokuapp.com/allDependencia/'+id)
    .catch(e=>{
      return Observable.of(e)
    })
  }

  // id : dependencia
  public getDependencia(id:string):Observable<Dependencia>{
    return this.httpClient.get<Dependencia>('https://aeeuc2018backend.herokuapp.com/dependencia/'+id)
    .catch(e=>{
      return Observable.of(e)
    })
  }

  public addDependencia(d:Dependencia): Observable<any>{
    return this.httpClient.post('https://aeeuc2018backend.herokuapp.com/dependencia', d)
    .catch(e=>{
      return Observable.of(e)
    })
  }

  public updateCenso(d:Dependencia){
    return this.httpClient.put('https://aeeuc2018backend.herokuapp.com/updateCenso', d)
    .catch(e=>{
      return Observable.of(e)
    })
  }

  public updateCiclo(d:Dependencia){
    return this.httpClient.put('https://aeeuc2018backend.herokuapp.com/updateCiclo', d)
    .catch(e=>{
      return Observable.of(e)
    })
  }

  public killDependencia(id){
    return this.httpClient.delete('https://aeeuc2018backend.herokuapp.com/dependencia/'+id)
    .catch(e=>{
      return Observable.of(e)
    })
  }

}
