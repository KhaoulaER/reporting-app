import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AgGridAngular } from 'ag-grid-angular';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  
})
export class AppComponent implements OnInit{
  title = 'reporting-frontend';
  constructor(private primengConfig: PrimeNGConfig,
     ){
      
     }

  ngOnInit() {
    this.primengConfig.ripple = true;
}

}
