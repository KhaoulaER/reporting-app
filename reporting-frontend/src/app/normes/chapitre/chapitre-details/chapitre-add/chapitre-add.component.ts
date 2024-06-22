import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ChapitreService } from '../../chapitre.service';
import { Chapitre } from '../../../model/norme';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chapitre-add',
  templateUrl: './chapitre-add.component.html',
  styleUrl: './chapitre-add.component.css'
})
export class ChapitreAddComponent implements OnInit{
  @Input() showAddForm: boolean = true;
  @Output() clickClose: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() clickAdd: EventEmitter<any> = new EventEmitter<any>();
  normeId: string ='';
  addChapitreForm=this.fb.group({
    titre: ['',[Validators.required]],
    description: ['',[Validators.required]]
  });

  constructor(
    private fb:FormBuilder, 
    private chapitreService:ChapitreService,
    private messageService:MessageService,
    private route:ActivatedRoute
  ){

  }
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.normeId = params.get('normeId') || '';
    });
  }

  closeForm(){
    this.clickClose.emit(true);
  }

  handleAddChapitre(){
    const postData={...this.addChapitreForm.value};
    this.chapitreService.addNewChapter(postData as Chapitre,this.normeId).subscribe(
      response => {
        this.clickAdd.emit(response);
        this.addChapitreForm.reset();
        this.clickClose.emit(true);
        this.messageService.add({severity:'success', summary:'Success', detail: 'Chaptre enregistre'});
      },
      error => {
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'Echec d enregistrement'});
      }
      
    )
  }

 
  get titre(){
    return this.addChapitreForm.controls['titre'];
  }
  get description(){
    return this.addChapitreForm.controls['description'];
  }

}
