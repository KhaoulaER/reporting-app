import { Component, OnInit } from '@angular/core';
import { RapportService } from './rapport.service';

@Component({
  selector: 'app-rapport',
  templateUrl: './rapport.component.html',
  styleUrl: './rapport.component.css'
})
export class RapportComponent implements OnInit{
  constructor(
    private rapportService:RapportService
  ){}
  ngOnInit(): void {
   // this.rapportService.generateRadarChartAsBase64()
  }

}
