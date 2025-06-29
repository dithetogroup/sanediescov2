import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationsService {

  constructor() { }



  isObjectNullUndefinedOrEmpty(obj: any): boolean {
    return obj === null || obj === undefined || Object.keys(obj).length === 0;
  }
}
