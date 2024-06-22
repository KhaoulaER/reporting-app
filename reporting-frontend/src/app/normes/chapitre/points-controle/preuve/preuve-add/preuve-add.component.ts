import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { PointsControle, Preuve } from '../../../../model/norme';
import { FormBuilder, Validators } from '@angular/forms';
import { PreuveService } from '../preuve.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-preuve-add',
  templateUrl: './preuve-add.component.html',
  styleUrl: './preuve-add.component.css'
})
export class PreuveAddComponent {
  @Input() showAddForm: boolean = true;
  @Input() selectedPcc:any = null;
  @Output() clickClose: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() clickAdd: EventEmitter<any> = new EventEmitter<any>();
  newPreuve!: Preuve;
  pcId: string = '';
  constructor(
    private fb:FormBuilder, 
    private preuveService:PreuveService,
    private messageService:MessageService,
    private route:ActivatedRoute
  ){}
  addPreuve=this.fb.group({
    designation: ['',[Validators.required]]
  })

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedPcc'] && this.selectedPcc) {
      this.pcId = this.selectedPcc.id;
    }
  }

  handleAddPreuve(){
    if (!this.pcId) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Point de contrôle non défini' });
      return;
    }
    const postData = { ...this.addPreuve.value };
    this.preuveService.addNewPreuve(postData as Preuve, this.selectedPcc).subscribe(
      response => {
        this.clickAdd.emit(response);
        this.addPreuve.reset();
        this.clickClose.emit(true);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Preuve enregistrée' });
      },
      error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Échec de l\'enregistrement' });
      }
    );
  }

  get designation(){
    return this.addPreuve.controls['designation'];
  }
}
