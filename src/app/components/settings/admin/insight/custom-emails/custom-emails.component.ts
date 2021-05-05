import { Component } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import { Color, Label, SingleDataSet } from 'ng2-charts';
import { GraphService } from 'src/app/services/graph/graph.service';

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

  colors: Color[] = this.graphService.colors;

  constructor(
    private graphService: GraphService) {
      this.graphService.resetGraphServiceArrays();
      graphService.getValues('email').then(() => {
        this.pieChartLabels = graphService.pieChartLabels;
        this.pieChartData = graphService.pieChartData;
        this.lineChartLabels = graphService.lineChartLabels;
        this.lineChartData = graphService.lineChartData;
      })
    }
}
