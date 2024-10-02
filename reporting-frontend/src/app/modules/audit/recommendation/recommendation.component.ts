import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-recommendation',
  templateUrl: './recommendation.component.html',
  styleUrl: './recommendation.component.css'
})
export class RecommendationComponent implements OnInit{
  @Input() displayRecommendation:boolean=true;
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

}
