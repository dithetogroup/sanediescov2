import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReadService {

  urlEndPoints : any = environment.urlEndPoints;
  redirectUrl!: string;

  constructor(private httpClient: HttpClient) { }


  //User Authentication
  Userlogin(lu_email: string, lu_password: string) {
    return this.httpClient.post<any>( `${this.urlEndPoints.Userlogin}`,
      { lu_email, lu_password },
      { withCredentials: true } 
    );
  }


  //Step Company Information
  StepGetCompanyInformation(esco_id: string) {
    return this.httpClient.get<any>(
     `${this.urlEndPoints.StepGetCompanyInformation}?esco_id=${esco_id}`
    );
  }
  StepGetCompanyInformationCICPFILE(esco_id: string) {
    return this.httpClient.get<any>(
    `${this.urlEndPoints.StepGetCompanyInformationCICPFILE}?esco_id=${esco_id}`
    );
  }
  getCompanyInfoHistory(esco_id: string) {
    return this.httpClient.get<any>(
      `${this.urlEndPoints.getCompanyInfoHistory}?esco_id=${esco_id}`
    );
  }


  //step Previous Projects
  StepGetPreviousProjects(esco_id: string) {
    return this.httpClient.get<any>(
     `${this.urlEndPoints.StepGetPreviousProjects}?esco_id=${esco_id}`
    );
  }
  StepGettPreviousProjectsReferenceLetters(esco_id: string) {
    return this.httpClient.get<any>(
    `${this.urlEndPoints.StepGettPreviousProjectsReferenceLetters}?esco_id=${esco_id}`
    );
  }

}
