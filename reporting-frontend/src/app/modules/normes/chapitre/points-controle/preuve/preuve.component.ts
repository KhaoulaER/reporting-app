import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Preuve } from '../../../model/norme';

@Component({
  selector: 'app-preuve',
  templateUrl: './preuve.component.html',
  styleUrl: './preuve.component.css'
})
export class PreuveComponent {
  @Input() showPreuves: boolean = true;
  @Input() selectedPcc: any = null;
  @Output() clickClose: EventEmitter<boolean> = new EventEmitter<boolean>();
  preuve!: Preuve;
  ngOnChanges(changes: SimpleChanges): void {
    if(this.selectedPcc){
      console.log('this is selected point', this.selectedPcc.id);
    }else{
      console.log('selected point is undefined');

    }
  }

  closeModal(){
    this.clickClose.emit(true);
  }
}
