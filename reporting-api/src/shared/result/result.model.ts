export class Result<T> {
    isSuccess: boolean;
    isFailure: boolean;
    error: T | string;
    private _value: T | undefined;
 
  
    constructor(isSuccess: boolean, error: T | string, value?: T) {
      this.isSuccess = isSuccess;
      this.isFailure = !isSuccess;
      this.error = error;
      this._value = value;
    }
  
    getValue(): T {
      if (this.isFailure) {
        throw new Error("Cannot get value on a failed result.");
      }
      return this._value as T;
    }
  
    static OK<U>(value?: U): Result<U> {
      return new Result(true, '', value);
    }
  
    static Fail<U>(error: U | string): Result<U> {
      return new Result(false, error, undefined);
    }
  }