import { Injectable } from '@angular/core';


const TOKEN_KEY = 'access_token';
const REFRESHTOKEN_KEY = 'refresh_token';

const EXECUTION = 'execution';
const FORMACTION = 'formAction';
const TEXT = 'text';
const COOKIE = 'cookie';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor() {}

  signOut(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESHTOKEN_KEY);
  }

  public saveToken(token: string): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(TOKEN_KEY);
    }
    return null;  }

  public saveRefreshToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(REFRESHTOKEN_KEY);
      localStorage.setItem(REFRESHTOKEN_KEY, token);
    }
  }

  public getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(REFRESHTOKEN_KEY);
    }
    return null;  }

  public saveRequiredAction(
    execution: string,
    formAction: string,
    cookie: string,
    text?: string
  ): void {
    this.removeRequiredAction();
    sessionStorage.setItem(EXECUTION, execution);
    sessionStorage.setItem(FORMACTION, formAction);
    sessionStorage.setItem(COOKIE, cookie);
    if (text) {
      sessionStorage.setItem(TEXT, text);
    }
  }

  public removeRequiredAction(): void {
    sessionStorage.removeItem(EXECUTION);
    sessionStorage.removeItem(FORMACTION);
    sessionStorage.removeItem(TEXT);
    sessionStorage.removeItem(COOKIE);
  }

  public getRequiredAction() {
    return {
      execution: sessionStorage.getItem(EXECUTION),
      formAction: sessionStorage.getItem(FORMACTION),
      text: sessionStorage.getItem(TEXT),
      cookie: sessionStorage.getItem(COOKIE),
    };
  }
}