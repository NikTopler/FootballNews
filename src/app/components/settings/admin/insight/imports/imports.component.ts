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


  }

}
