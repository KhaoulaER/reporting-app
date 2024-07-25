//////////////////////  WORKING COMPONENT //////////////////////
import { Component, NgModule, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NormeAdopte } from '../projets/model/projet';
import { AuditService } from './audit.service';
import { Chapitre, PointsControle, Preuve } from '../normes/model/norme';
import { Audit, PcAudit } from './model/audit';
import { UUID } from 'angular2-uuid';
import { AuditValidationService } from './audit-validation/audit-validation.service';
import { MessageService } from 'primeng/api';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { ConformiteService } from './conformite/conformite.service';
import { ConformiteComponent } from './conformite/conformite.component';
import { CommonModule } from '@angular/common';
import { RapportService } from '../rapport/rapport.service';

@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.css']
})
export class AuditComponent implements OnInit {
  //Recuperation des infos a partir de la norme adopte
  normeAdopte!: NormeAdopte;
  chapitres!: Chapitre[];
  errorMessage!: string;
  normeId!: string;
  chapitreForms: FormGroup;
  niveau = ['N/A', 'Initial', 'Reproductible', 'Défini', 'Maîtrisé', 'Optimisé'];
  pointControle!: PointsControle;
  audit!: Audit;
  //PREUVES
  visible = false;
  preuvesSelectionnees: { [pointControleId: string]: Preuve[] } = {};
  //Bouton de validation
  isValidateButtonClicked = false;
  isProjectManager: boolean = false;
  //conformite
  showConformite: boolean = false;
  //repport

  constructor(
    private auditService: AuditService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private auditValidationService: AuditValidationService,
    private conformiteService: ConformiteService,
    private rapportService: RapportService,
    private messageService: MessageService
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
  
  this.normeId = this.route.snapshot.paramMap.get('normeId')!;
  this.loadChapitres();
  this.saveAudit();

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
       
      // Affichez la structure de `projet`
      console.log('Projet: ', this.normeAdopte.projet);

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

  ////////////////////////////////////////// CREATION ET INITIALISATION DU FORM ARRAY /////////////////////////
  initializeForms(latestEvaluations: any[]): void {
    const chapitresFormArray = this.chapitreForms.get('chapitres') as FormArray;
    this.chapitres.forEach(chapitre => {
      chapitresFormArray.push(this.createChapitreFormGroup(chapitre, latestEvaluations));
    });
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
    return this.fb.group({
      designation: [point.designation],
      id: [point.id],
      niveau_maturite: [latestEvaluation ? latestEvaluation.niveau_maturite : ''],
      constat: [latestEvaluation ? latestEvaluation.constat : ''],
      commentaire: [latestEvaluation ? latestEvaluation.commentaire: ''],
     // preuves: this.createPreuveFormArray(point.preuve)
    });
  }
 
 /////////////////////////////////// RECUPERER LES POINTS DE CONTROLE PAR CHAPITRE /////////////////////
  getPointFormGroup(chapitreIndex: number, pointIndex: number): FormGroup {
    const chapitresFormArray = this.chapitreForms.get('chapitres') as FormArray;
    const chapitreFormGroup = chapitresFormArray.at(chapitreIndex) as FormGroup;
    const pointsControleFormArray = chapitreFormGroup.get('pointsControle') as FormArray;
    return pointsControleFormArray.at(pointIndex) as FormGroup;
  }

//////////////////////////////////// ENREGISTRER L'OPERATION D'AUDIT ///////////////////////////////////////
  saveAudit(): void {
    const auditData = {
      date_audit: new Date(),
    };
    const auditeur = '28f5df5a-101b-a3ea-bd95-577747746e55'; // ID de l'auditeur connecté
    this.auditService.createAudit(auditData, auditeur, this.normeAdopte.id).subscribe({
      next: (audit) => {
        console.log('Audit saved successfully:', audit);
        this.audit = audit;
      },
      error: (err) => {
        console.error('Error saving audit:', err);
      }
    });
  }
//////////////////////////////////////////// ENREGISTRER LES PONITS DE CONTROLE AUDITES ////////////////////////
  savePcAudites(): void {
    const evaluations = this.getEvaluations().map(evaluation => ({
      id: UUID.UUID(), // Ajouter un ID ici
      pc: evaluation.pointControle,
      niveau_maturite: evaluation.niveauMaturite,
      constat: evaluation.constat,
      commentaire: evaluation.commentaire,
      //preuves: evaluation.preuves, // Associez les preuves ici
      audit: this.audit
    }));
  
    console.log('Evaluations:', evaluations); // Log evaluations data
    this.auditService.createPcAudites(evaluations as PcAudit[]).subscribe({
      next: (data) => {
        console.log('PcAudites saved successfully:', data);
        this.auditValidationService.setValidationState(true);
      },
      error: (err) => {
        console.error('Error saving PcAudites:', err);
      }
    });
  }
  ///////////////////////////////////// LES EVALUATIONS DES POINTS DE CONTROLE ///////////////////////////////
  getEvaluations(): any[] {
    const evaluations: any[] = [];
    const chapitresFormArray = this.chapitreForms.get('chapitres') as FormArray;
  
    chapitresFormArray.controls.forEach((chapitreControl: AbstractControl, chapitreIndex: number) => {
      const chapitreGroup = chapitreControl as FormGroup;
      const pointsControleFormArray = chapitreGroup.get('pointsControle') as FormArray;
  
      pointsControleFormArray.controls.forEach((pointControl: AbstractControl) => {
        const pointGroup = pointControl as FormGroup;
        evaluations.push({
          pointControle: {
            id: pointGroup.get('id')?.value,
            designation: pointGroup.get('designation')?.value,
            chapitreTitre: this.chapitres[chapitreIndex].titre
          },
          niveauMaturite: pointGroup.get('niveau_maturite')?.value,
          constat: pointGroup.get('constat')?.value,
          commentaire: pointGroup.get('commentaire')?.value, 
        });
      });
    });
  
    return evaluations;
  }
  
     //////////////////////////////// FONCTION D'EXPORTATION /////////////////////////////////////////////

    exportToExcel(): void {
      const evaluations = this.getEvaluations();
      const formattedData: any[] = [];
      evaluations.forEach((evaluation) => {
        formattedData.push({
          chapitre: evaluation.pointControle.chapitreTitre,
          regles: evaluation.pointControle.designation,
          niveau_maturite: evaluation.niveauMaturite,
          constat: evaluation.constat,
          commentaire: evaluation.commentaire || ''
        });
      });
  
      // Récupérer les données de conformité
      this.auditService.findTotalNiveau(this.normeId).subscribe(dataConformite => {
        this.rapportService.generateExcel(formattedData, dataConformite, this.niveau, 'NS_Rapport', this.normeAdopte);
      });
    }
      
    /////////////////////////// CONFORMITE PAR CHAPITRE ///////////////////////////////////////
    getConformite(): void {
      this.showConformite = !this.showConformite; // Bascule l'état de visibilité
    }


    ///////////////////////////////////////// LES PREUVES ///////////////////////////////////////////////////

  /*getPreuveOptions(point: PointsControle): Preuve[] {
    const chapitreIndex = this.chapitres.findIndex(chapitre => chapitre.pointsControle.includes(point));
    const pointIndex = this.chapitres[chapitreIndex].pointsControle.indexOf(point);
    return this.chapitres[chapitreIndex].pointsControle[pointIndex].preuve;
  }*/
  /*createPreuveFormArray(preuves: Preuve[]): FormArray {
    const formArray = this.fb.array(
      preuves.map(preuve => this.fb.group({
        designation: [preuve.designation],
        checked: [false]  // Ensure 'checked' control is correctly defined
      }))
    );
    return formArray;
  }*/
   // get preuves form
  /*getPreuveFormArray(point: PointsControle): FormArray {
    const chapitreIndex = this.chapitres.findIndex(chapitre => chapitre.pointsControle.includes(point));
    const pointIndex = this.chapitres[chapitreIndex].pointsControle.indexOf(point);
    const chapitresFormArray = this.chapitreForms.get('chapitres') as FormArray;
    const chapitreFormGroup = chapitresFormArray.at(chapitreIndex) as FormGroup;
    const pointsControleFormArray = chapitreFormGroup.get('pointsControle') as FormArray;
    return pointsControleFormArray.at(pointIndex).get('preuves') as FormArray;
  }*/

  /*handlePreuvesSubmit(data: { preuves: Preuve[], pcAudit: PcAudit }): void {
    if (this.pointControle) {
      this.preuvesSelectionnees[this.pointControle.id] = data.preuves;
      console.log('Preuves sélectionnées pour le point de contrôle', this.pointControle.id, ':', data.preuves);
    } else {
      console.error('Erreur : point de contrôle non défini.');
    }
  }*/
}
