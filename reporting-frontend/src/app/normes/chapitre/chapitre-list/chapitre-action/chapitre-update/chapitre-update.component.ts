import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ChapitreService } from '../../../chapitre.service';
import { Chapitre } from '../../../../model/norme';

@Component({
  selector: 'app-chapitre-update',
  templateUrl: './chapitre-update.component.html',
  styleUrl: './chapitre-update.component.css'
})
export class ChapitreUpdateComponent implements OnChanges{
 
  @Input() display: boolean = true;
  @Input() selectedChapitre: any = null;

  @Output() clickCloseMod: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() clickAddMod: EventEmitter<any> = new EventEmitter<any>();
  constructor(private fb: FormBuilder,
    private messageService:MessageService,
    private chapitreService:ChapitreService
  ){}
  ngOnChanges(): void {
    if(this.selectedChapitre){
      this.updateForm.patchValue(this.selectedChapitre);
    }else{
      this.updateForm.reset();
    }
  }

  updateForm = this.fb.group({
    titre: ['',[Validators.required]],
    description:['',[Validators.required]]
  });

  closeModal(){
    this.clickCloseMod.emit(true);
  }

  handleSubmit(){
    const updatedData=this.updateForm.value;
    this.chapitreService.updateChapitre(updatedData as Chapitre, this.selectedChapitre).subscribe(
      response => {
        this.clickAddMod.emit(response);
        this.clickCloseMod.emit(true);
        console.log(response);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Norme modifiée' });

      },
      error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
        console.log('Error occured');
      }
    )
  }

  get titre(){
    return this.updateForm.controls['titre'];
  }
  get description(){
    return this.updateForm.controls['description'];
  }

}
