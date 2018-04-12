import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';

import { Institucion } from '../classes/institucion';

import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class InstitucionService {

  url
  url_prd = 'https://aeeuc2018backend.herokuapp.com'
  url_dev = 'http://localhost:5000'

  constructor( private httpClient:HttpClient ) { 
    this.url=this.url_prd
  }


  public allInstitucion(): Observable<Institucion[]>{
    return this.httpClient.get<Institucion>( this.url+'/institucion')
    .catch(e=>{
      return Observable.of(e)
    })
  }

  public getInstitucion(id:string): Observable<Institucion>{
    return this.httpClient.get<Institucion>( this.url+'/institucion/'+id)
    .catch(e=>{
      return Observable.of(e)
    })
  }

  public agregarInstitucion(e:Institucion):Observable<any>{
    return this.httpClient.post( this.url+'/institucion', e)
    .catch(e=>{
      return Observable.of(e)
    })
  }

  public killInstitucion(id){
    return this.httpClient.delete(this.url+'/institucion/'+id)
    .catch(e=>{
      return Observable.of(e)
    })
  }

}
