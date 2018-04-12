import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Usuario } from '../classes/usuario';

@Injectable()
export class UsuarioService {

  url
  url_prd = 'https://aeeuc2018backend.herokuapp.com'
  url_dev = 'http://localhost:5000'

  constructor( private httpClient:HttpClient ) { 
    this.url=this.url_prd
  }

  login(email:string, password:string): Observable<any>{

    let body = 'email='+ email+'&password='+password
    let headers = new HttpHeaders({ 'Content-type':'application/x-www-form-urlencoded' })

    return this.httpClient.post(this.url+'/login', body, {headers} ).map((data:any)=>{
    
      if(data.token){
        
        console.log(data.message)        
        sessionStorage.setItem('token', data.token)
        
        return data.user
        
      }else{        
        return false
      }      
      
    }).catch(e=>{  
      return Observable.of(e.error.message)
    })

  }


  alluser():Observable<any>{
    return this.httpClient.get(this.url+'/usuarios')
    .catch(e=>{
      return Observable.of(e)
    })
  }

  public getAllUser(): Observable<any>{

    let headers = new HttpHeaders({ 'Authorization': 'Bearer '+localStorage.getItem('token') })
    return this.httpClient.get<any>(this.url+'/usuarios/', { headers })
    .catch(e=>{
      return Observable.of(e)
    })
  }
 

  public accessValid(username:string): Observable<Boolean>{

    let headers = new HttpHeaders({ 'Authorization': 'Bearer '+localStorage.getItem('token') })
    return this.httpClient.get<boolean>(this.url+'/auth/'+username, {headers})
    .catch(e=>{
      return Observable.of(e)
    })
  }

  public getUserById(userId:string): Observable<Usuario>{

    let headers = new HttpHeaders({ 'Authorization': 'Bearer '+localStorage.getItem('token') })
    return this.httpClient.get(this.url+'/usuario_id/'+userId, { headers })
    .catch(e=>{
      return Observable.of(e)
    })
  }
  public getUser(email:string): Observable<Usuario>{

    let headers = new HttpHeaders({ 'Authorization': 'Bearer '+localStorage.getItem('token') })
    return this.httpClient.get(this.url+'/usuario/'+email, { headers })
    .catch(e=>{
      return Observable.of(e)
    })
  }


  // ************************************ POST ************************************************************
  // ------------------------------------------------------------------------------------------------------

  public createUser(usuario:Usuario): Observable<any> {

    let headers = new HttpHeaders({ 'Authorization': 'Bearer '+localStorage.getItem('token') })
    return this.httpClient.post(this.url+'/usuario', usuario,{headers})
    .catch(e=>{
      return Observable.of(e)
    })
  }

  // ************************************ PUT ************************************************************
// ------------------------------------------------------------------------------------------------------

  public updateUser(usuario:Usuario){

    let headers = new HttpHeaders({ 'Authorization': 'Bearer '+localStorage.getItem('token') })
    return this.httpClient.put(this.url+'/usuario', usuario, {headers})
    .catch(e=>{
      return Observable.of(e)
    })    
  }

  public updatePass(usuario:Usuario){

    let headers = new HttpHeaders({ 'Authorization': 'Bearer '+localStorage.getItem('token') })
    return this.httpClient.put(this.url+'/acutalizarPass', usuario, {headers})
    .catch(e=>{
      return Observable.of(e)
    })
  }

 // ************************************ DELETE ************************************************************
  // ------------------------------------------------------------------------------------------------------

  public deleteUser(usuario:Usuario){
    let headers = new HttpHeaders().set('Authorization', 'Bearer '+localStorage.getItem('token'))
    return this.httpClient.delete(this.url+'/usuario/'+usuario._id, { headers})
    .catch(e=>{
      return Observable.of(e)
    })
  }

}
