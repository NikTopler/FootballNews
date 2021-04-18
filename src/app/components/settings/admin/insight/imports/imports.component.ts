import { Component } from '@angular/core';
import { Chart, ChartType, ChartOptions } from 'chart.js';
import { SingleDataSet, Label, Color } from 'ng2-charts';
import { CommService } from 'src/app/services/comm/comm.service';
import { UserService } from 'src/app/services/user/user.service';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-imports',
  templateUrl: './imports.component.html',
  styleUrls: ['./imports.component.scss']
})
export class ImportsComponent {

  pieChartOptions: ChartOptions = { responsive: true, maintainAspectRatio: false };
  pieChartLabels: Label[] = [];
  pieChartData: SingleDataSet = [];
  pieChartType: ChartType = 'pie';
  pieChartLegend = true;
  pieChartPlugins = [];

  lineChartOptions: ChartOptions = { responsive: true, maintainAspectRatio: false };
  lineChartLabels: Label[] = [];
  lineChartData: SingleDataSet = [];
  lineChartType: ChartType = 'line';
  lineChartLegend = true;
  lineChartPlugins = [];

  colors: Color[] = [
    {
      backgroundColor: [
        '#ff4081',
        'rgba(0,172,193,1)',
        'rgba(84,58,183,1)'
      ]
    }
  ];

  constructor(
    private comm: CommService,
    private userService: UserService) { this.getValues(); }

  async getValues() {
    const req = await fetch(`${environment.db}/graph.php`, {
      method: 'POST',
      body: this.comm.createFormData('ADMIN_IMPORT', '')
    });
    const res = await req.text();
    const data = JSON.parse(res).data;

    const adminImports = JSON.parse(res).data.admin_imports;
    const yourImports = JSON.parse(res).data.your_imports;

    this.allAdminImports(adminImports);
    this.yourImports(yourImports);
  }

  allAdminImports(array: string[][]) {

    let admin: string = `${array[0][0]} ${array[0][1]}`;
    let counter: number = 0;

    for(let i = 0; i < array.length; i++) {
      if(!this.pieChartLabels.includes(`${array[i][0]} ${array[i][1]}`))
        this.pieChartLabels.push(`${array[i][0]} ${array[i][1]}`);

      if(`${array[i][0]} ${array[i][1]}` === admin && array.length !== i+1)
        counter++;
      else {
        this.pieChartData.push(counter);
        counter = 0;
        admin = `${array[i][0]} ${array[i][1]}`;
      }
    }
  }

}
