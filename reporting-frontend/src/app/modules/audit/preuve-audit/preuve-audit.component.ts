/*import { Component, EventEmitter, Input, Output, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { PointsControle, Preuve } from '../../normes/model/norme';

@Component({
  selector: 'app-preuve-audit',
  templateUrl: './preuve-audit.component.html',
  styleUrls: ['./preuve-audit.component.css']
})
export class PreuveAuditComponent implements OnInit {
  @Input() visible: boolean = true;
  @Input() pointControle!: PointsControle;
  @Output() close = new EventEmitter<void>();


    preuveForm!: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pointControle'] && this.pointControle) {
      this.initForm();
    }
  }

  initForm(): void {
    this.preuveForm = this.fb.group({
      preuves: this.fb.array(this.pointControle.preuve.map(() => this.fb.control(false))),
      //commentaire: ['']
    });
  }

  get preuves(): FormArray {
    return this.preuveForm.get('preuves') as FormArray;
  }

  // Traitement des preuves et du commentaire
  submit(): void {
    const selectedPreuves = this.preuveForm.value.preuves
      .map((checked: boolean, i: number) => checked ? this.pointControle.preuve[i] : null)
      .filter((preuve: Preuve | null) => preuve !== null);
    //const commentaire = this.preuveForm.value.commentaire;

    // Vous pouvez maintenant traiter les preuves sélectionnées et le commentaire ici
    console.log('Preuves sélectionnées:', selectedPreuves);
   // console.log('Commentaire:', commentaire);

    this.close.emit();
  }
}*/
import { Component, EventEmitter, Input, Output, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { PointsControle, Preuve } from '../../normes/model/norme';

@Component({
  selector: 'app-preuve-audit',
  templateUrl: './preuve-audit.component.html',
  styleUrls: ['./preuve-audit.component.css']
})
export class PreuveAuditComponent implements OnInit {
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  ///////////////////// PREUVE V4 /////////////////////////
  @Input() preuveData!: Preuve[];
  @Output() preuvesSubmit = new EventEmitter<{ preuves: Preuve[] }>();
  selectedPreuves: Preuve[] = [];

  onPreuveChange(preuve: Preuve, isChecked: boolean) {
    if (isChecked) {
      this.selectedPreuves.push(preuve);
    } else {
      const index = this.selectedPreuves.indexOf(preuve);
      if (index > -1) {
        this.selectedPreuves.splice(index, 1);
      }
    }
  }

  submitPreuves() {
    this.preuvesSubmit.emit({ preuves: this.selectedPreuves });
  }





  /////////////PREUVE V3 ///////////////////////
  /*@Input() visible: boolean = true;
  @Input() pointControle!: PointsControle;
  @Input() pcAuditId!: string; // Ajout d'un input pour PcAudit ID
  @Output() close = new EventEmitter<void>();
  @Output() submitPreuves = new EventEmitter<{ preuves: Preuve[], pcAuditId: string }>(); // Modification de l'output pour inclure PcAudit ID

  preuveForm!: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    if (this.pointControle) {
      this.initForm();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pointControle'] && this.pointControle) {
      this.initForm();
    }
  }

  initForm(): void {
    if (this.pointControle && this.pointControle.preuve) {
      this.preuveForm = this.fb.group({
        preuves: this.fb.array(this.pointControle.preuve.map(() => this.fb.control(false)))
      });
    }
  }

  get preuves(): FormArray {
    return this.preuveForm.get('preuves') as FormArray;
  }

  // Traitement des preuves cochées et soumission des preuves vérifiées
  submit(): void {
    const selectedPreuves = this.preuveForm.value.preuves
      .map((checked: boolean, i: number) => checked ? this.pointControle.preuve[i] : null)
      .filter((preuve: Preuve | null) => preuve !== null);

    // Affichage des preuves cochées dans la console
    console.log('Preuves cochées:', selectedPreuves);

    // Émettre les preuves vérifiées avec tous leurs attributs et PcAudit ID
    this.submitPreuves.emit({ preuves: selectedPreuves as Preuve[], pcAuditId: this.pcAuditId });
    this.close.emit();
  }*/


  /////////////  PREUVE V2 //////////////
 /* @Input() visible: boolean = true;
  @Input() pointControle!: PointsControle;
  @Output() close = new EventEmitter<void>();
  @Output() submitPreuves = new EventEmitter<{ preuves: Preuve[], commentaire: string }>();

  preuveForm!: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    if (this.pointControle) {
      this.initForm();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pointControle'] && this.pointControle) {
      this.initForm();
    }
  }

  initForm(): void {
    if (this.pointControle && this.pointControle.preuve) {
      this.preuveForm = this.fb.group({
        preuves: this.fb.array(this.pointControle.preuve.map(() => this.fb.control(false)))
      });
    }
  }

  get preuves(): FormArray {
    return this.preuveForm.get('preuves') as FormArray;
  }

  // Traitement des preuves et du commentaire
  submit(): void {
    const selectedPreuves = this.preuveForm.value.preuves
      .map((checked: boolean, i: number) => checked ? this.pointControle.preuve[i] : null)
      .filter((preuve: Preuve | null) => preuve !== null);
    const commentaire = this.preuveForm.value.commentaire;

    // Affichage des preuves cochées dans la console
    console.log('Preuves cochées:', selectedPreuves);

    // Émettre les preuves sélectionnées et le commentaire
    this.submitPreuves.emit({ preuves: selectedPreuves, commentaire });
    this.close.emit();
  }*/

  ////////// PREUVE V1///////////////////

  /*@Input() visible: boolean = true;
  @Input() pointControle!: PointsControle;
  @Output() close = new EventEmitter<void>();
  @Output() submitPreuves = new EventEmitter<{ preuves: Preuve[], commentaire: string }>();

  preuveForm!: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pointControle'] && this.pointControle) {
      this.initForm();
    }
  }

  initForm(): void {
    this.preuveForm = this.fb.group({
      preuves: this.fb.array(this.pointControle.preuve.map(() => this.fb.control(false))),
      commentaire: ['']
    });
  }

  get preuves(): FormArray {
    return this.preuveForm.get('preuves') as FormArray;
  }

  // Traitement des preuves et du commentaire
  submit(): void {
    const selectedPreuves = this.preuveForm.value.preuves
      .map((checked: boolean, i: number) => checked ? this.pointControle.preuve[i] : null)
      .filter((preuve: Preuve | null) => preuve !== null);
    const commentaire = this.preuveForm.value.commentaire;

    // Émettre les preuves sélectionnées et le commentaire
    this.submitPreuves.emit({ preuves: selectedPreuves, commentaire });
    this.close.emit();
  }*/
}


