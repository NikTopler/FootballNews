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
  pieChartLabels: Label[] = ['Nik Topler', 'Janez Novak'];
  pieChartData: SingleDataSet = [5, 3];
  pieChartType: ChartType = 'pie';
  pieChartLegend = true;
  pieChartPlugins = [];

  lineChartOptions: ChartOptions = { responsive: true, maintainAspectRatio: false };
  lineChartLabels: Label[] = ['20.11.2021', '24.11.2021', '26.11.2021', '27.11.2021'];
  lineChartData: SingleDataSet = [0, 1, 4, 1];
  lineChartType: ChartType = 'line';
  lineChartLegend = false;
  lineChartPlugins = [];

  colors: Color[] = this.graphService.colors;

  constructor(
    private graphService: GraphService) {
      this.graphService.resetGraphServiceArrays();
      graphService.getValues('email').then(() => {
        // this.pieChartLabels = graphService.pieChartLabels;
        // console.log(graphService.pieChartData);

        // this.pieChartData = graphService.pieChartData;
        // this.lineChartLabels = graphService.lineChartLabels;
        // this.lineChartData = graphService.lineChartData;
      })
    }
}
