import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConformiteService {

  constructor() { }
  private conformiteVisibleSubject = new BehaviorSubject<boolean>(false);
  conformiteVisible$ = this.conformiteVisibleSubject.asObservable();

  toggleConformite(visible: boolean): void {
    this.conformiteVisibleSubject.next(visible);
  }

  getCurrentVisibility(): boolean {
    return this.conformiteVisibleSubject.value;
  }

  calculerMoyenne(res:number[]): number{
    if(res.length === 0){
      return 0;
    }
    const sm = res.reduce((acc,courante)=>acc+courante,0);
    return sm/res.length;
  }
}
