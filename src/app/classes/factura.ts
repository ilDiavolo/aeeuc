export class Factura {
    constructor(

        public fecha:Date,
        public numero_factura: string,        
        public kwh: number,
        public kva: number,
        public tarifa: number,
        public monto: number

    ){}
}

