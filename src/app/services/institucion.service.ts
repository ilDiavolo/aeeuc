import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';

import { Institucion } from '../classes/institucion';

import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class InstitucionService {

  url_prd = 'https://aeeuc2018backend.herokuapp.com'
  url_dev = 'http://localhost:5000'

  constructor( private httpClient:HttpClient ) { }


  public allInstitucion(): Observable<Institucion[]>{
    return this.httpClient.get<Institucion>('https://aeeuc2018backend.herokuapp.com/institucion')
    .catch(e=>{
      return Observable.of(e)
    })
  }

  public getInstitucion(id:string): Observable<Institucion>{
    return this.httpClient.get<Institucion>('https://aeeuc2018backend.herokuapp.com/institucion/'+id)
    .catch(e=>{
      return Observable.of(e)
    })
  }

  public agregarInstitucion(e:Institucion):Observable<any>{
    return this.httpClient.post('https://aeeuc2018backend.herokuapp.com/institucion', e)
    .catch(e=>{
      return Observable.of(e)
    })
  }

}
