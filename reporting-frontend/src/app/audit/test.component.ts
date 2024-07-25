[00:20, 30/6/2024] Soumia: import {Component, OnInit} from '@angular/core';
import {Grade, OrganismeAttache, RepartitionGradeSpecialite, SpecialitePoste} from "../../../interfaces/entities";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ReferenceService} from "../../../services/reference.service";
import {EventBusService} from "../../../services/event-bus.service";
import {SubSink} from "subsink";
import {RepartitionAttacheService} from "../../../services/repartition-attache.service";
import {lineValidator} from "../../../validators/line.validator";
import {EMPTY, switchMap, tap} from "rxjs";
import {Logger} from "../../../utils/logger";
import {UsersService} from "../../../services/users.service";

@Component({
  selector: 'app-repartition-poste',
  templateUrl: './repartition-poste.component.html',
  styleUrls: ['./repartition-poste.component.css']
})
export class RepartitionPosteComponent implements OnInit {
  logger = new Logger(this)
  subsink = new SubSink()

  grades: Grade[] = [];
  specialites: SpecialitePoste[] = [];
  organismesAttaches: OrganismeAttache[] = [];
  organismesTutelles$ = this.referenceService.organismesTutelles();


  form!: FormGroup;


  constructor(private referenceService: ReferenceService,
              private eventBusService: EventBusService,
              private repartitionAttacheService: RepartitionAttacheService,
              private formBuilder: FormBuilder,
              private userService : UsersService) {


  }

  ngOnInit(): void {

    this.form = this.formBuilder.group({
      organismeTutelle: new FormControl(null, Validators.required),
      organismeAttache: new FormControl(null, Validators.required),
      repartitions: this.formBuilder.array([])
    });


    this.subsink.sink = this.referenceService.grades().subscribe(
      data => this.grades = data)
    this.subsink.sink = this.referenceService.specialites().subscribe(
      data => this.specialites = data)


    this.subsink.sink = this.form.get('organismeAttache')?.valueChanges.pipe(
      tap(oa => this.charger(oa)
      )).subscribe();

    this.subsink.sink = this.form.get('organismeTutelle')?.valueChanges.pipe(
      tap(organismeTutelle => {
        if (!organismeTutelle || (this.form.get('organismeAttache')?.value != null && organismeTutelle?.id != this.form.get('organismeAttache')?.value.organismeTutelle?.id)) {
          this.organismesAttaches = []
          this.form.get('organismeAttache')?.reset()
        }
      }),
      switchMap((organismeTutelle) => {
        if (!organismeTutelle) {
          return EMPTY
        }
        return this.referenceService.organismesAttachesByOrganismeTutelle(organismeTutelle.id);
      }),
      tap(organismesAttaches => this.organismesAttaches = organismesAttaches)
    ).subscribe();
  }

  get repartitions() {
    return this.form.get('repartitions') as FormArray;
  }

  addPost(rgs?: RepartitionGradeSpecialite) {
    const canRemoveOrEdit = ((rgs?.nbrPostesConsommes && rgs?.nbrPostesConsommes > 0) || (rgs?.nbrPostesHandicapConsommes && rgs?.nbrPostesHandicapConsommes > 0)) ? false : true
    const r = this.formBuilder.group({
      data: [{id: rgs?.id ?? null, canRemoveOrEdit, nbrPostesConsommes: rgs?.nbrPostesConsommes}],
      specialite: [{value: rgs?.specialite ?? null, disabled: !canRemoveOrEdit}, [Validators.required]],
      grade: [{value: rgs?.grade ?? null, disabled: !canRemoveOrEdit}, [Validators.required]],
      militaire: [{value: rgs?.militaire ?? false, disabled: !canRemoveOrEdit}, [Validators.required]],
      nbrPostes: [rgs?.nbrPostes ?? 1, [Validators.required, (rgs?.nbrPostesConsommes) ? Validators.min(rgs?.nbrPostesConsommes) : Validators.min(1)]],
      nbrPostesHandicap: [rgs?.nbrPostesHandicap ?? 0, [Validators.required, (rgs?.nbrPostesHandicapConsommes) ? Validat…
[00:21, 30/6/2024] Soumia: import {Injectable} from '@angular/core';
import {HttpService} from "./http.service";
import {Observable} from "rxjs";
import {RepartitionAttache, RepartitionGradeSpecialite} from "../interfaces/entities";
import {endpoints} from "../consts/endpoints";

@Injectable({
  providedIn: 'root'
})
export class RepartitionAttacheService {

  constructor(private httpService: HttpService) {
  }

  getByOrganismeAttacheAndAnneeBudgetaire(anneeBudgetaireId: number, organismeAttacheId: number): Observable<RepartitionAttache> {
    return this.httpService.get(endpoints.repartitionAttache.getByAnneeBudgetaireAndOrganismeAttache +
      "anneeBudgetaireId=" + anneeBudgetaireId + "&organismeAttacheId=" + organismeAttacheId, {showErrorAlert: false})
  }

  getByActiveAnneeAndOrganismeAttache(organismeAttacheId: number): Observable<RepartitionGradeSpecialite[]> {
    return this.httpService.get(endpoints.repartitionAttache.getByActiveAnneeAndOrganismeAttache(organismeAttacheId), {showErrorAlert: false})
  }

  updateByActiveAnneeAndOrganismeAttache(organismeAttacheId: number, reparitions: RepartitionGradeSpecialite[]): Observable<void> {
    return this.httpService.put(endpoints.repartitionAttache.updateByActiveAnneeAndOrganismeAttache(organismeAttacheId), reparitions)
  }
}