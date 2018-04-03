import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'horaMilitar'
})
export class HoraMilitarPipe implements PipeTransform {

  transform(value: any, args?: any): any {

    let horas = Math.trunc(value)
    let minutos:any = '00'
    if( (value%1)>0 ){ minutos=30 }
    
    return `${horas}:${minutos}`

  }

}
