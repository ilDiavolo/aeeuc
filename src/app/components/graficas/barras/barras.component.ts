import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-barras',
  templateUrl: './barras.component.html',
  styleUrls: ['./barras.component.scss']
})
export class BarrasComponent implements OnInit {

  @Input() public dataEnter:any

  public barChartLabels:string[] = ['Iluminación', 'Climatización', 'Tecnología',
  'Laboratorio', 'Elevación', 'Cosina', 'Otros'];
  
  public barChartData:any[] = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
    {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'}
  ];
 
  public barChartOptions:any = { scaleShowVerticalLines: false, responsive: true };
  public barChartType:string = 'bar';
  public barChartLegend:boolean = true;
 
  // events
  public chartClicked(e:any):void {
    console.log(e);
  }
 
  public chartHovered(e:any):void {
    console.log(e);
  }
 
  public randomize():void {
    // Only Change 3 values
    let data = [
      Math.round(Math.random() * 100),
      59,
      80,
      (Math.random() * 100),
      56,
      (Math.random() * 100),
      40];
    let clone = JSON.parse(JSON.stringify(this.barChartData));
    clone[0].data = data;
    this.barChartData = clone;
    /**
     * (My guess), for Angular to recognize the change in the dataset
     * it has to change the dataset variable directly,
     * so one way around it, is to clone the data, change it and then
     * assign it;
     */
  }

  ngOnInit() {

    console.log(this.dataEnter[0])
  

    let newData = [
      {data: [13, 24, 35, 46, 57, 67, 78], label: 'LBE'},
      {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'}
    ]

    this.barChartData = newData
  }

}
