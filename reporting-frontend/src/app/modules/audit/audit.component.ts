//////////////////////  WORKING COMPONENT //////////////////////
import { Component, NgModule, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NormeAdopte } from '../projets/model/projet';
import { AuditService } from './audit.service';
import { Chapitre, PointsControle, Preuve } from '../normes/model/norme';
import { Audit, PcAudit } from './model/audit';
import { UUID } from 'angular2-uuid';
import { AuditValidationService } from './audit-validation/audit-validation.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { ConformiteService } from './conformite/conformite.service';
import { ConformiteComponent } from './conformite/conformite.component';
import { CommonModule } from '@angular/common';
import { RapportService } from '../rapport/rapport.service';
import { TestPromptService } from '../test-prompt/test-prompt.service';
import { AuthenticationService } from '../../core/authentication/authentication.service';
import { RoleService } from '../../core/services/role.service';
import { forkJoin } from 'rxjs';
import { RapportWordService } from '../rapport/rapport-word/rapport-word.service';
import * as JSZip from 'jszip';

@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.css']
})
export class AuditComponent implements OnInit {
  //Recuperation des infos a partir de la norme adopte
 // @ViewChild(ConformiteComponent) conformiteComponent!: ConformiteComponent; // Access ConformiteComponent

  auditeurName!:string;
  manager!:any;
  normeAdopte!: NormeAdopte;
  chapitres!: Chapitre[];
  errorMessage!: string;
  normeId!: string;
  chapitreForms: FormGroup;
  niveau = ['N/A', 'Aucun', 'Initial', 'Reproductible', 'Défini', 'Maîtrisé', 'Optimisé'];
  niveauT = ['N/A','Non_conforme','Partielle','Totale']
  pointControle!: PointsControle;
  audit!: Audit;
  auditeur!:any;
////// display modall save pc audit
  displayModal: boolean = false;
  niveauInput: string = 'N/A'
  selectedNiveau: string=''
  constatInput: string = '';
  addedConstats: string[] = [];
  preuveInput: string = '';
  addedPreuves: string[]=[];
  recommandationInput: string = '';

  addedConstat: string = '';
  addedpreuve: string = '';
  addedRecommandation: string = '';

  editedConstat: string='';
  editConstat:boolean = false;
  editPreuve:boolean = false;
  selectedPointIndex!: number;
  selectedChapitreIndex!:number;
  selectedPointsControle: PointsControle | null = null;
  prevConstat:string='';
  prevPreuve:string='';
  editedPreuve!: string;
  editedRecommandation!:string;
  prevRecommadation!:string;
  editRecommadation:boolean=false;

  // Create a map to store constats for each pointControle by its ID
  constatsMap: { [point: string]: any[] }={};
  preuvesMap: { [point: string]: any[] }={};
  niveauMap: { [point: string]: any} = {}
  recomMap: { [point: string]: any} = {}
  allConstats:any[]=[];
  //PREUVES
  visible = false;
  preuvesSelectionnees: { [pointControleId: string]: Preuve[] } = {};
  //Bouton de validation
  isValidateButtonClicked = false;
  isProjectManager: boolean = false;
  //conformite
  showConformite: boolean = false;
  //repport
  //RECOMMENDATIONS
  recommandations!: string;
  displayRecommandation: boolean=false;
  selectedPcAudit!:any;
// Une structure pour suivre la visibilité des recommandations
recommandationVisible: { [key: string]: boolean } = {};

isReadOnly: boolean = false;
isManager: boolean = false;

//FIX THE SENT DATA ISSUE
originalEvaluations: any[] = [];

  constructor(
    private auditService: AuditService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private auditValidationService: AuditValidationService,
    private conformiteService: ConformiteService,
    private rapportService: RapportService,
    private rapportWordService: RapportWordService,
    private messageService: MessageService,
    private testPromptService:TestPromptService,
    private authService:AuthenticationService,
    private roleService:RoleService,
    private confirmationService:ConfirmationService
  ) {
    this.chapitreForms = this.fb.group({
      chapitres: this.fb.array([])
    });
  }

  //verification du role-----------DANS HEAD-------
  checkIfProjectManager(): void {
    const path = this.route.snapshot.url.map(segment => segment.path).join('/');
    console.log('Route path:', path);
    this.isProjectManager = path.includes('audit-manager');
    console.log('Is Project Manager:', this.isProjectManager);
  }
  // Fonction pour désactiver les inputs
  isInputDisabled(): boolean {
    return this.isValidateButtonClicked || this.normeAdopte?.validation === true;
  }

  disableFormControls(): void {
    const chapitresFormArray = this.chapitreForms.get('chapitres') as FormArray;
    chapitresFormArray.controls.forEach((chapitreControl: AbstractControl) => {
      const chapitreGroup = chapitreControl as FormGroup;
      const pointsControleFormArray = chapitreGroup.get('pointsControle') as FormArray;

      pointsControleFormArray.controls.forEach((pointControl: AbstractControl) => {
        pointControl.disable(); // Désactiver le contrôle du point de contrôle
      });
    });
  }

  initializeValidationState(): void {
    this.auditValidationService.validateButtonClicked$.subscribe(isValidated => {
      this.isValidateButtonClicked = isValidated;
      if (this.isValidateButtonClicked || this.normeAdopte?.validation === true) {
        // Désactiver les champs de formulaire ici
        this.disableFormControls();
      }
    });
  }

  
  ngOnInit(): void {
  this.auditeurName = this.authService.authenticatedUser?.fullName || '';
  console.log('auditeur id in compo: ', this.auditeurName)
  console.log('is save button: ',this.isSaveButtonVisible())

  this.normeId = this.route.snapshot.paramMap.get('normeId')!;
  console.log('audit norme Id:', this.normeId)
  if (this.normeId) {
    this.auditService.findNCP(this.normeId).subscribe(data => {
      const projetId = data.nms[0]?.projet?.id;
      this.manager=data.nms[0]?.projet?.project_manager;
      
      
      console.log('manager',this.manager)
      console.log('pro id role: ', projetId)
      
        this.checkUserRole(projetId);
     
    });
  }
  this.loadChapitres();
  this.saveAudit();
  //First auditor for a pro with constat
  this.auditService.getFirstAuditor(this.normeId).subscribe(
    (data)=>{
      this.auditeur=data
      console.log('auditeur ecrit: ',this.auditeur)
    }
  )
  console.log('auditeur ecrit: ',this.auditeur)
  console.log('evals: ',this.getEvaluations())
  // Initialisation de l'état de validation
  this.auditValidationService.validateButtonClicked$.subscribe(isValidated => {
    this.isValidateButtonClicked = isValidated;
    if (this.isValidateButtonClicked || this.normeAdopte?.validation) {
      this.disableFormControls();
    }
  });

}

/////////////////////////////////////////// RECUPERER LES CHAPITRES /////////////////////////////
  loadChapitres(): void {
    this.auditService.findNCP(this.normeId).subscribe({
      next: (data) => {
        this.normeAdopte = data.nms[0];
        this.chapitres = data.nms[0].norme.chapitre;
        this.initializeForms(data.latestEvaluations);


       /* this.originalEvaluations = this.getEvaluations().filter(evaluation => {
          return evaluation.niveauMaturite || evaluation.constat || evaluation.preuve;
        }) || [];        
        console.log('original eval: ',this.originalEvaluations)*/
      // Affichez la structure de `projet`
      console.log('Projet: ', this.normeAdopte.projet);
      this.loadAllConstatsForAllPoints()

      // Vérifiez si projet et client sont définis
      if (this.normeAdopte.projet && this.normeAdopte.projet.client) {
        console.log('Client: ', this.normeAdopte.projet.client.nom);
      } else {
        console.log('Client non défini ou projet non défini.');
      }
      },
      error: (err) => {
        this.errorMessage = `Failed to load chapitres`;
      }
    });
  }

  ////////////////////////// LOAD CONSTATS ///////////
  pointId:string='';
    loadAllConstatsForAllPoints(): void {
      
      this.chapitres.forEach(chapitre => {
        chapitre.pointsControle.forEach(pointControle => {
          const pointId = pointControle.id;
          
          // Recupérer les constats d'un point de controle selectionné
          this.auditService.findConstatsForPoint(pointId, this.normeId).subscribe({
            next: (constats) => {
              this.constatsMap[pointId] = constats;

              
              this.originalEvaluations = this.getEvaluations().filter(evaluation => {
                return evaluation.niveauMaturite || evaluation.constat || evaluation.preuve;
              }) || [];        
             // console.log('original eval: ',this.originalEvaluations)
              //console.log('constats for point: ',this.constatsMap[pointId])
              
            },
            error: (err) => {
              console.error(`Failed to load constats for point: ${pointId}`, err);
            }
          });
          //Fetch generated recommandations
          this.auditService.findRecommandationForPoint(pointId,this.normeId).subscribe({
            next: (recommandation) => {
              this.recomMap[pointId] = recommandation || ''
            },
            error: (err) => {
              console.error(`Failed to load recoms for point: ${pointId}`, err);
            }
          })
    
           // Fetch the existing niveau maturite for the control point
      this.auditService.findNiveau(pointId, this.normeId).subscribe({
        next: (niveauMaturite) => {
          // Store the single niveau maturite for this point
          this.niveauMap[pointId] = niveauMaturite || '';  // Store directly in the point object
          //this.niveauInput = this.niveauMap[this.pointId]

          //console.log('niveau map: ',this.niveauMap[pointId])
        },
        error: (err) => {
          console.error(`Failed to load niveau maturite for point: ${pointId}`, err);
        }
      });
          // Recupérer les documents vérifiés d'un point de controle selectionné
          this.auditService.findPreuvesForPoint(pointId, this.normeId).subscribe({
            next: (preuves) => {
              this.preuvesMap[pointId] = preuves;
            },
            error: (err) => {
              console.error(`Failed to load preuves for point: ${pointId}`, err);
            }
          });
        });
      });
    }


  ////////////////////////////////////////// CREATE AND INITIIALIZE FORM ARRAY /////////////////////////
  initializeForms(latestEvaluations: any[]): void {
    const chapitresFormArray = this.chapitreForms.get('chapitres') as FormArray;
    this.chapitres.forEach(chapitre => {
      chapitresFormArray.push(this.createChapitreFormGroup(chapitre, latestEvaluations));
    });
  }

  // Opens the modal and sets the current control point
  openModal(chapitreIndex:number,index: number, pointsControle: PointsControle): void {
    this.selectedPointIndex = index;
    this.selectedChapitreIndex=chapitreIndex;
    this.selectedPointsControle = pointsControle;
    this.pointId=this.selectedPointsControle?.id
    //console.log('selected control point: ',this.selectedPointsControle.designation)
    //console.log('pc id selected: ',this.selectedPointsControle)
    const niveauMaturite = this.niveauMap[this.pointId]?.niveau_maturite;
    this.niveauInput = niveauMaturite ? niveauMaturite : 'N/A';
  

    console.log('niveau map in modal: ',this.niveauMap[this.pointId])

    this.loadAllConstatsForAllPoints();
    this.displayModal = true;
  }

  closeModal(): void {
    this.displayModal = false;
    this.constatInput=""
    this.preuveInput=""
    this.addedConstat=""
    this.addedpreuve=""
  }

  createChapitreFormGroup(chapitre: Chapitre, latestEvaluations: any[]): FormGroup {
    const pointsControleFormArray = this.fb.array(
      chapitre.pointsControle.map(point => this.createPointFormGroup(point, latestEvaluations))
    );
    return this.fb.group({
      titre: [chapitre.titre],
      pointsControle: pointsControleFormArray
    });
  }

  createPointFormGroup(point: PointsControle, latestEvaluations: any[]): FormGroup {
    const latestEvaluation = latestEvaluations.find(e => e.pcId === point.id);
    const pointFormGroup = this.fb.group({
      designation: [point.designation],
      id: [point.id],
      niveau_maturite: [latestEvaluation ? latestEvaluation.niveau_maturite : 'N/A'],
      constat: [latestEvaluation ? latestEvaluation.constat : ''],
      preuve: [latestEvaluation ? latestEvaluation.preuve : ''],
      recommandation: [latestEvaluation ? latestEvaluation.recommandation : '']
    });

    

    return pointFormGroup;
  }

  //Display objective
shouldDisplayObjectif(point: any, index: number, pointsControle: any[]): boolean {
  // Show the objectif only if it's the first time it's encountered or it's different from the previous one
  return index === 0 || point.objectif !== pointsControle[index - 1].objectif;
}

getRowspan(point: any, index: number, pointsControle: any[]): number {
  let rowspan = 1;
  // Count how many consecutive points have the same objectif
  for (let i = index + 1; i < pointsControle.length; i++) {
    if (pointsControle[i].objectif === point.objectif) {
      rowspan++;
    } else {
      break;
    }
  }
  return rowspan;
}

 
generateRecommandations(): void {
  const norme = this.normeAdopte.norme.designation;
      const pointId = this.selectedPointsControle?.id;
      const pc = this.selectedPointsControle?.designation;
      const constats = (this.constatsMap[this.pointId] || []).map((c: any) => c.constat);  // Extract constat strings
      console.log('pcc: ', pc)
      console.log('constats for recom; ', constats)
     this.testPromptService.testPrompt(norme, pc, constats).subscribe({
        next: (response) => {
          this.recommandationInput = response.recommandation || '';
          this.addedRecommandation=this.recommandationInput
        },
        error: (err) => {
          console.error('Error generating recommandations:', err);
        }
  });

 
}
 /////////////////////////////////// GET POINTS DE CONTROLE BY CHAPTER /////////////////////
  getPointFormGroup(chapitreIndex: number, pointIndex: number): FormGroup {
    const chapitresFormArray = this.chapitreForms.get('chapitres') as FormArray;
    const chapitreFormGroup = chapitresFormArray.at(chapitreIndex) as FormGroup;
    const pointsControleFormArray = chapitreFormGroup.get('pointsControle') as FormArray;
    return pointsControleFormArray.at(pointIndex) as FormGroup;
  }

//////////////////////////////////// SAVE AUDIT ///////////////////////////////////////

    saveAudit(): void {
      const auditData= {
        date_audit: new Date(),
       
      };
    
      console.log('norme adopte: ', this.normeAdopte);
      
      this.auditService.createAudit(this.normeId, auditData as Audit).subscribe({
        next: (audit) => {
          console.log('Audit saved successfully:', audit);
          this.audit = audit;
        },
        error: (err) => {
          console.error('Error saving audit:', err);
        }
      });
    }
//////////////////////////////////////////// SAVE AUDITED CONTROL POINTS ////////////////////////
 // Called when the modal is validated
 addConstat(): void {
  //const pointId = this.selectedPointsControle?.id;
  if (this.constatInput.trim()) {
    this.constatsMap[this.pointId].push({ constat: this.constatInput });
    console.log('constat Map: ',this.constatsMap[this.pointId])
    this.addedConstat = this.constatInput;
    console.log('added constat:',this.addedConstat)
    this.constatInput = ''; // Reset the input field
  }
}
addpreuve(): void {
  this.addedpreuve = this.preuveInput;
  if(this.preuveInput.trim()){
    this.preuvesMap[this.pointId].push({preuve: this.preuveInput});
    console.log('preuve Map: ',this.preuvesMap[this.pointId])
    this.addedpreuve=this.preuveInput
    console.log('added preuve:',this.addedpreuve)
    this.preuveInput = ''; // Reset the input field
  }
}
saveEvaluation(pointId: string): void {
  const selectedPoint = this.selectedPointsControle;
  console.log(`selected point id ${selectedPoint?.id}`)
  const constats = this.addedConstat;
  const preuves = this.addedpreuve;
  const recommandation = this.addedRecommandation;
  console.log('added constat in save:', this.addedConstat)
  const auditData = {
    id:UUID.UUID(),
    pc: this.pointId,
    niveau_maturite: this.niveauInput,
    constat:constats,
    preuve:preuves,
    recommandation:recommandation,
    audit:this.audit.id
  };
  console.log('audit DATA; ',auditData)

  // Send this data to the service that handles saving to the database
  this.auditService.createPcAudites(auditData as unknown as PcAudit).subscribe(
    response => {
      console.log('Audit data saved:', response);
      this.messageService.add({ severity: 'success', summary: 'Saved', detail: 'Audit data saved successfully.' });
    },
    error => {
      console.error('Error saving audit data:', error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to save audit data.' });
    }
  );
}

//remove constat before validating it

delConstat():void{
  this.addedConstat='';
  this.constatInput='';
}
//delete constat by the manager
delConstatForever(pointId: string, constat: string) {
  console.log('Attempting to delete constat:', constat, 'for pointId:', pointId); // Debugging line

  if(this.editConstat){
  const pcAudit = this.constatsMap[pointId]?.find(c => c.constat === constat);
  console.log('PC Audit to delete:', pcAudit); // Debugging line

  if (pcAudit && pcAudit.id) {
    this.auditService.deleteConstat(pcAudit.id).subscribe({
      next: () => {
        // Successfully deleted constat, and removed from UI
        this.constatsMap[pointId] = this.constatsMap[pointId].filter(c => c.constat !== constat);
        console.log('Deleted constat successfully'); // Debugging line
      },
      error: (err) => {
        console.error('Failed to delete constat:', err);
      }
    });
  } else {
    console.log('PC Audit not found for deletion'); // Debugging line
  }
}
  else{
  this.confirmationService.confirm({
    message: 'Voulez-vous supprimer ce constat ?',
    header: 'Confirmer la suppression',
    icon: 'pi pi-info-circle',
    rejectButtonStyleClass: "p-button-danger p-button-text",
    acceptButtonStyleClass: "p-button-text p-button-text",
    acceptIcon: "none",
    rejectIcon: "none",
    accept: () => {
      const pcAudit = this.constatsMap[pointId]?.find(c => c.constat === constat);
      console.log('PC Audit to delete:', pcAudit); // Debugging line

      if (pcAudit && pcAudit.id) {
        this.auditService.deleteConstat(pcAudit.id).subscribe({
          next: () => {
            // Successfully deleted constat, and removed from UI
            this.constatsMap[pointId] = this.constatsMap[pointId].filter(c => c.constat !== constat);
            console.log('Deleted constat successfully'); // Debugging line
          },
          error: (err) => {
            console.error('Failed to delete constat:', err);
          }
        });
      } else {
        console.log('PC Audit not found for deletion'); // Debugging line
      }
    },
    reject: () => {
      console.log('Deletion rejected'); // Debugging line
    }
  });}
}

editConstatForever(pointId: string, constat: string){
  this.constatInput = constat;
  this.prevConstat = constat;
  this.editConstat=true
}
EditConstat(pointId:string,prevConstat:string){
  this.editedConstat=this.constatInput
  const pcAudit = this.constatsMap[pointId]?.find(c => c.constat === prevConstat);
  console.log('PC Audit to edit:', pcAudit); // Debugging line
  console.log('edited constat: ',this.editedConstat)
  console.log('previous constat: ',prevConstat)
  this.delConstatForever(pointId,prevConstat)
  this.addConstat()
  /*this.auditService.updateConstat(pcAudit.id,this.editedConstat as unknown as PcAudit).subscribe({
    next: () => {
      // Successfully deleted constat, and removed from UI
      this.constatsMap[pointId] = this.constatsMap[pointId].filter(c => c.constat !== prevConstat);
      console.log('Edited constat successfully'); // Debugging line
    },
    error: (err) => {
      console.error('Failed to edit constat:', err);
    }
  }
  )*/
}

//remove preuve before validating it
delPreuve():void{
  this.addedpreuve = ''
  this.preuveInput=''
}

delPreuveForever(pointId: string, preuve: string){
  const pcAudit = this.preuvesMap[pointId].find(pv => pv.preuve === preuve);

        if (pcAudit && pcAudit.id) {
          this.auditService.deletePreuve(pcAudit.id).subscribe({
            next: () => {
              // Successfully deleted constat, now remove it from UI
              this.preuvesMap[pointId] = this.preuvesMap[pointId].filter(pv => pv.preuve !== preuve);
            },
            error: (err) => {
              console.error('Failed to delete constat:', err);
            }
          });
        }
   
}

editPreuveForever(pointId: string, preuve: string){
  this.preuveInput = preuve;
  this.prevPreuve = preuve;
  this.editPreuve=true
  
}
Editpreuve(pointId:string,prevPreuve:string){
  this.editedPreuve=this.preuveInput
  const pcAudit = this.preuvesMap[pointId]?.find(c => c.constat === prevPreuve);
  console.log('PC Audit to edit:', pcAudit); // Debugging line
  console.log('edited preuve: ',this.editedPreuve)
  console.log('previous preuve: ',prevPreuve)
  this.delPreuveForever(pointId,prevPreuve)
  this.addpreuve()
}

addRecommandation(): void {
  this.recommandationVisible[this.pointId] = true;
  if (!this.isValidateButtonClicked || this.normeAdopte?.validation) {
    this.generateRecommandations();
  }

}
delRecommandationForever(pointId: string, recommandation: string){
  const pcAudit = this.recomMap[pointId].find((rc: { recommandation: string; }) => rc.recommandation === recommandation);

        if (pcAudit && pcAudit.id) {
          this.auditService.deleteRecommandation(pcAudit.id).subscribe({
            next: () => {
              // Successfully deleted constat, now remove it from UI
              this.recomMap[pointId] = this.recomMap[pointId].filter((rc: { recommandation: string; }) => rc.recommandation === recommandation);
            },
            error: (err) => {
              console.error('Failed to delete constat:', err);
            }
          });
        }
   
}
editRecommandationForever(pointId:string,recommandation:string){
  this.recommandationInput = recommandation;
  this.prevRecommadation = recommandation;
  this.editRecommadation=true
}
Editrecommadation(pointId:string,prevRecommadation:string){
  this.editedPreuve=this.preuveInput
  const pcAudit = this.recomMap[pointId]?.find((rc: { constat: string; }) => rc.constat === prevRecommadation);
  console.log('PC Audit to edit:', pcAudit); // Debugging line
  console.log('edited preuve: ',this.editedRecommandation)
  console.log('previous preuve: ',prevRecommadation)
  this.delRecommandationForever(pointId,prevRecommadation)
  this.addRecommandation()

}
validateDetails(): void {
  const pointId = `${this.selectedChapitreIndex}-${this.selectedPointIndex}`;
  // Process and save the collected constats and preuves for this control point
  this.saveEvaluation(pointId);
  this.closeModal();
}

savePcAudites(): void {
  const changedEvaluations = this.getEvaluations()
    .filter((evaluation, index) => {
      // Find corresponding original evaluation if available
      const originalEval = this.originalEvaluations.find(origEval => origEval.pointControle.id === evaluation.pointControle.id);

      // Check if the evaluation has meaningful fields that are non-empty
      const hasMeaningfulEvaluation = evaluation.niveauMaturite || evaluation.constat || evaluation.preuve || evaluation.recommandation;

      // Check if the evaluation has changed compared to the original evaluation
      const isEvaluationChanged = originalEval && (
        evaluation.niveauMaturite !== originalEval.niveauMaturite ||
        (evaluation.constat && evaluation.constat !== originalEval.constat) ||
        (evaluation.preuve && evaluation.preuve !== originalEval.preuve) ||
        (evaluation.recommandation && evaluation.recommandation !== originalEval.recommandation)
      );

      // Only include evaluations that are meaningful and have changed
      return hasMeaningfulEvaluation && (!originalEval || isEvaluationChanged);
    })
    .map(evaluation => ({
      id: UUID.UUID(), // Generating a unique ID for new evaluations
      pc: evaluation.pointControle,
      niveau_maturite: evaluation.niveauMaturite,
      constat: evaluation.constat,
      preuve: evaluation.preuve,
      recommandation: evaluation.recommandation,
      audit: this.audit
    }));

  if (changedEvaluations.length > 0) {
    this.auditService.createPcAudites(changedEvaluations as unknown as PcAudit).subscribe({
      next: (data) => {
        this.auditValidationService.setValidationState(true);
        console.log('Audit evaluations saved:', data);
        // Update the original evaluations after saving
        this.originalEvaluations = this.getEvaluations().filter(evaluation => {
          return evaluation.niveauMaturite || evaluation.constat || evaluation.preuve;
        }) || [];
      },
      error: (err) => {
        console.error('Error saving PcAudites:', err);
      }
    });
  } else {
    console.log("No changes detected, nothing to save.");
  }

  console.log('Changed evaluations:', changedEvaluations);
}


/////////////////////// CHECK AUDITOR ROLE////////////////////////
checkUserRole(projetId: string): void {
  const userRoles = this.roleService.getRole() || [] // assuming authService stores roles
  console.log('user roles: ',userRoles)
  const projectRole = userRoles.find(role => role.includes(projetId));
  console.log('project role: ',projectRole)
  if (projectRole) {
    this.isReadOnly = projectRole.endsWith('read-only');
  }
  console.log('read? = ', this.isReadOnly)

  this.isManager=this.roleService.isManager();
  console.log('is manager: ',this.isManager)
}


//show save button
isSaveButtonVisible(): boolean {
  // The button should be shown if normeAdopte?.validation is false, or the user is a manager, or the form is not read-only
  if(!this.normeAdopte?.validation && !this.isReadOnly || this.isManager)
    return true;
  else
    return false;
}

getEvaluations(): any[] {
  const evaluations: any[] = [];
  const chapitresFormArray = this.chapitreForms.get('chapitres') as FormArray;

  chapitresFormArray.controls.forEach((chapitreControl: AbstractControl, chapitreIndex: number) => {
    const chapitreGroup = chapitreControl as FormGroup;
    const pointsControleFormArray = chapitreGroup.get('pointsControle') as FormArray;

    pointsControleFormArray.controls.forEach((pointControl: AbstractControl) => {
      const pointGroup = pointControl as FormGroup;
      const pointId = pointGroup.get('id')?.value;
     // console.log('evaluation pid: ',pointId)

      // Gather all constats for the current control point
      const constatsForPoint = this.constatsMap[pointId] || [];
     // console.log('constatsMap for point; ', this.constatsMap)
      // Convert list of constats to a string or handle according to your needs
      const constatList = constatsForPoint.map(con => `- ${con.constat}`).join('\n');
      //console.log('Constat list:', constatList); 
      //console.log("constats map: ",constatList)
      //preuve list
      const preuveForPoint = this.preuvesMap[pointId] || [];
      const preuveList = preuveForPoint.map(pv => pv.preuve).join('\n')

      const recommandationForPoint = this.recomMap[pointId] || [];
      const recommandationList = recommandationForPoint.map((rc: { recommandation: any; }) => rc.recommandation).join('\n')

      const niveauForPoint = this.niveauMap[pointId] || '';
      const niveauVal = niveauForPoint.niveau_maturite
      const evaluation = {
        pointControle: {
          id: pointGroup.get('id')?.value,
          designation: pointGroup.get('designation')?.value,
          chapitreTitre: this.chapitres && this.chapitres[chapitreIndex] ? this.chapitres[chapitreIndex].titre : 'Unknown'
        },
        niveauMaturite: niveauVal,
        constat: constatList,
        preuve: preuveList,
      
        recommandation: recommandationList
      };

      evaluations.push(evaluation);
    });
  });

  return evaluations;
}
  
     //////////////////////////////// EXPORT REPORTS /////////////////////////////////////////////

    exportToExcel(): void {
      const evaluations = this.getEvaluations();
      const formattedData: any[] = [];
      evaluations.forEach((evaluation) => {
        formattedData.push({
          chapitre: evaluation.pointControle.chapitreTitre,
          regles: evaluation.pointControle.designation,
          niveau_maturite: evaluation.niveauMaturite,
          constat: evaluation.constat,
          preuve: evaluation.preuve || '',
          recommandation: evaluation.recommandation
        });
      });
  
     // this.conformiteComponent.captureChartImage();

    this.auditService.findTotalNiveau(this.normeId).subscribe(dataConformite => {
      if (this.normeAdopte?.norme?.echel === '0->3') {
        this.rapportService.generateExcel(formattedData, dataConformite, this.niveauT, 'NS_Rapport', this.normeAdopte);
      } else {
        this.rapportService.generateExcel(formattedData, dataConformite, this.niveau, 'NS_Rapport', this.normeAdopte);
      }
    });

    }

    exportToWord():void{
      const evaluations = this.getEvaluations();
      const formattedData: any[] = [];
      evaluations.forEach((evaluation) => {
        formattedData.push({
          chapitre: evaluation.pointControle.chapitreTitre,
          regles: evaluation.pointControle.designation,
          niveau_maturite: evaluation.niveauMaturite,
          constat: evaluation.constat,
          preuve: evaluation.preuve || '',
          recommandation: evaluation.recommandation
        });
      });

      
    this.auditService.findTotalNiveau(this.normeId).subscribe(dataConformite => {
      if (this.normeAdopte?.norme?.echel === '0->3') {
        this.rapportWordService.generateWordReport(formattedData, dataConformite, this.niveauT, 'NS_Rapport', this.normeAdopte, this.auditeur,this.manager);
      } else {
        this.rapportWordService.generateWordReport(formattedData, dataConformite, this.niveau, 'NS_Rapport', this.normeAdopte, this.auditeur,this.manager);
      }
    });

    }

    exportReports(){
      this.exportToExcel()
      this.exportToWord()
      this.auditService.checkDowloadState(this.audit.id).subscribe({
        next: (response) => {
          // Update the audit object with the updated control state
          const updatedAudit = this.audit.downloaded=true;
  
          console.log('report downloaded: ', updatedAudit);
          //this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Audit Verifié !' });
        },
        error: (err) => {
          console.error('Error updating audit control state:', err);
          //this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to verify audit.' });
        }
      })
    }
    
    /////////////////////////// CONFORMITY BY CHAPTER ///////////////////////////////////////
    getConformite(): void {
      this.showConformite = !this.showConformite; // Bascule l'état de visibilité
    }

}
