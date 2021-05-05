import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import { Color, Label, SingleDataSet } from 'ng2-charts';
import { CommService } from 'src/app/services/comm/comm.service';
import { UserService } from 'src/app/services/user/user.service';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-custom-emails',
  templateUrl: './custom-emails.component.html',
  styleUrls: ['./custom-emails.component.scss']
})
export class CustomEmailsComponent {

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


}
