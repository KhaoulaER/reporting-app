import { Component, Input, OnInit } from '@angular/core';
import { Chapitre, PointsControle } from '../../normes/model/norme';
import { Audit, PcAudit } from '../model/audit';
import { AbstractControl, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { AuditService } from '../audit.service';
import { NormeAddComponent } from '../../normes/norme-details/norme-add/norme-add.component';
import { NormeAdopte } from '../../projets/model/projet';
import { UUID } from 'angular2-uuid';
import { AuditValidationService } from '../audit-validation/audit-validation.service';
import { TestPromptService } from '../../test-prompt/test-prompt.service';

@Component({
  selector: 'app-pc-audit',
  templateUrl: './pc-audit.component.html',
  styleUrl: './pc-audit.component.css'
})
export class PcAuditComponent implements OnInit{
  
  niveau = ['N/A', 'Initial', 'Reproductible', 'Défini', 'Maîtrisé', 'Optimisé'];
  @Input() pointControle!:PointsControle;
  @Input() audit!:Audit;
  chapitreForms: FormGroup;
  @Input() normeAdopte!:NormeAdopte
  @Input() normeId='';
  @Input() chapitres!: Chapitre[];
  errorMessage!: string;

  constructor(
    private auditService:AuditService,
    private fb:FormBuilder,
    private auditValidationService:AuditValidationService
  ){
    this.chapitreForms = this.fb.group({
      chapitres: this.fb.array([])
    });
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
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
      preuve: [latestEvaluation ? latestEvaluation.preuve: ''],
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



  /////////////////////////// CONFORMITE PAR CHAPITRE ///////////////////////////////////////
  getConformite(): void {
      
  }

  //////////////////////////////////////////// ENREGISTRER LES PONITS DE CONTROLE AUDITES ////////////////////////
  savePcAudites(): void {
    const evaluations = this.getEvaluations().map(evaluation => ({
      id: UUID.UUID(), // Ajouter un ID ici
      pc: evaluation.pointControle,
      niveau_maturite: evaluation.niveauMaturite,
      constat: evaluation.constat,
      preuve: evaluation.preuve,
      //preuves: evaluation.preuves, // Associez les preuves ici
      audit: this.audit
    }));
  
    console.log('Evaluations:', evaluations); // Log evaluations data
    this.auditService.createPcAudites(evaluations as unknown as PcAudit).subscribe({
      next: (data) => {
        console.log('PcAudites saved successfully:', data);
        //this.auditValidationService.setValidationState(true);
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
          preuve: pointGroup.get('preuve')?.value, 
        });
      });
    });
  
    return evaluations;
  }

  ////////////////////////// Generartion des recommendations ///////////////////
  getRecommendations(){

  }
}
