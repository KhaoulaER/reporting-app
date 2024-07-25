import { IError } from './authentification.model';

export class AuthenticationErrors implements IError {
  code: string;
  message: string;
  error?: any;

  constructor(code: string, message: string, error?: any) {
    this.code = code;
    this.message = message;
    this.error = error;
  }

  // static create(code: string, message: string, error?: any) {
  //   return new AuthenticationErrors(code, message, error);
  // }

  static unauthorizedError(message: string) {
    return new AuthenticationErrors('401', message);
  }

  static notFoundError(message: string) {
    return new AuthenticationErrors('404', message);
  }
}

export class UnknownKeycloakError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CustomError';
  }

  static create(data?: any) {
    return new UnknownKeycloakError(data || 'Default error message');
  }
}
