import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Dependencia } from '../classes/dependencia';


@Injectable()
export class DependenciaService {

  url
  url_prd = 'https://aeeuc2018backend.herokuapp.com'
  url_dev = 'http://localhost:5000'

  constructor( private httpClient:HttpClient ) { 
    this.url=this.url_prd 
  }
    

  public allDependencia(id:string):Observable<Dependencia[]>{
    return this.httpClient.get<Dependencia>( this.url+'/allDependencia/'+id)
    .catch(e=>{
      return Observable.of(e)
    })
  }

  // id : dependencia
  public getDependencia(id:string):Observable<Dependencia>{
    return this.httpClient.get<Dependencia>(this.url+'/dependencia/'+id)
    .catch(e=>{
      return Observable.of(e)
    })
  }

  public addDependencia(d:Dependencia): Observable<any>{
    return this.httpClient.post(this.url+'/dependencia', d)
    .catch(e=>{
      return Observable.of(e)
    })
  }

  public updateCenso(d:Dependencia){
    return this.httpClient.put(this.url+'/updateCenso', d)
    .catch(e=>{
      return Observable.of(e)
    })
  }

  public updateCiclo(d:Dependencia){
    return this.httpClient.put(this.url+'/updateCiclo', d)
    .catch(e=>{
      return Observable.of(e)
    })
  }

  public killDependencia(id){
    return this.httpClient.delete(this.url+'/dependencia/'+id)
    .catch(e=>{
      return Observable.of(e)
    })
  }

}
