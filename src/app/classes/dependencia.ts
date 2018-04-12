import { Carga } from './carga'
import { Factura } from './factura'

export class Dependencia {
    constructor(

        public _id:string,
        public id_institucion:any,
        public nombre:string,
        public area_util:number,
        public area_bruta:number,
        public indicadores_lbe: number[],
        public compania_electrica:string,
        public nic:string,
        public numero_medidor:string,
        public facturado:Factura[],
        public censo:Carga[],
        public ciclo:any,
        public lbe:any,
        public plan:Carga[]

    ){}
}
