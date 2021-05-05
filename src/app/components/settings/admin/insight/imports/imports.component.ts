import { Component } from '@angular/core';
import { ChartType, ChartOptions } from 'chart.js';
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
  lineChartLegend = false;
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
      body: this.comm.createFormData('ADMIN_IMPORT', 'import')
    });
    const res = await req.text();
    const data = JSON.parse(res).data;

    const adminImports = data.admin_data;
    const yourImports = data.your_data;

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

  yourImports(array: string[][]) {

    let counter: number = 0;
    let firstDate: boolean = true;
    let lastDate: string = '';

    for(let i = 0; i < array.length; i++) {
      if(array[i][2] !== this.userService.userInfo?.email)
        continue;

      const number = Number(array[i][4]);
      const date = new Date(number * 1000)
      const fullDate = ((date.getDate() > 9) ? date.getDate() : '0' + date.getDate()) + '-' + (((date.getMonth()+1) > 9) ? (date.getMonth()+1) : '0' + (date.getMonth()+1) + '-' + date.getFullYear());

      if(firstDate) {
        const dayBefore = (((date.getDate() - 1) > 9) ? (date.getDate() - 1) : '0' + (date.getDate() - 1)) + '-' + (((date.getMonth()+1) > 9) ? (date.getMonth()+1) : '0' + (date.getMonth()+1) + '-' + date.getFullYear());
        this.lineChartLabels.push(dayBefore);
        this.lineChartData.push(0)
        firstDate = false;
        lastDate = fullDate;
      }

      if(!this.lineChartLabels.includes(fullDate))
        this.lineChartLabels.push(fullDate);

      if(lastDate === fullDate) {
        counter++;
      } else {
        this.lineChartData.push(counter);
        lastDate = fullDate;
        counter = 1;
      }
      if(array.length - 1 === i) {
        this.lineChartData.push(counter - 1);
      }
    }

    if(counter > 0) this.lineChartData.push(counter - 1);
  }
}
