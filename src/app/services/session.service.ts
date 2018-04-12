import { Injectable } from '@angular/core';

@Injectable()
export class SessionService {


  userActive:string=''

  constructor() { }


  public setUserActive(name:string){
    this.userActive = name
  }

  public getUserActive():string{
    return this.userActive
  }

}
