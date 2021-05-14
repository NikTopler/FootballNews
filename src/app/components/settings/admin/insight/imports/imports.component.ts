import { Component } from '@angular/core';
import { ChartType, ChartOptions } from 'chart.js';
import { SingleDataSet, Label, Color } from 'ng2-charts';
import { GraphService } from 'src/app/services/graph/graph.service';

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

  colors: Color[] = this.graphService.colors;

  constructor(private graphService: GraphService) {
    this.graphService.resetGraphServiceArrays();
    graphService.getValues('import').then(() => {
      this.pieChartLabels = graphService.pieChartLabels;
      this.pieChartData = graphService.pieChartData;
      this.lineChartLabels = graphService.lineChartLabels;
      this.lineChartData = graphService.lineChartData;
    })
  }
}
