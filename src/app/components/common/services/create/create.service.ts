import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CreateService {

  urlEndPoints : any = environment.urlEndPoints;
  redirectUrl!: string;

  constructor(private httpClient: HttpClient, private router: Router) { }

  public StepSaveCompanyInformation(formData: any) {
    //return this.httpClient.post<any>(this.urlEndPoints.StepSaveCompanyInformation, formData,  { withCredentials: true });
    return this.httpClient.post<any>(this.urlEndPoints.StepSaveCompanyInformation, formData);
  }

  public StepSaveCompanyPreviousProjects(formData: any) {
    //return this.httpClient.post<any>(this.urlEndPoints.StepSaveCompanyInformation, formData,  { withCredentials: true });
    return this.httpClient.post<any>(this.urlEndPoints.StepSaveCompanyPreviousProjects, formData);
  }

  public StepSaveClientReferences(formData: any) {
    //return this.httpClient.post<any>(this.urlEndPoints.StepSaveCompanyInformation, formData,  { withCredentials: true });
    return this.httpClient.post<any>(this.urlEndPoints.StepSaveClientReferences, formData);
  }

  public StepSaveCompanyEquiity(formData: any) {
    //return this.httpClient.post<any>(this.urlEndPoints.StepSaveCompanyInformation, formData,  { withCredentials: true });
    return this.httpClient.post<any>(this.urlEndPoints.StepSaveCompanyEquiity, formData);
  }

  public StepSaveKeyEmployee(formData: any) {
    //return this.httpClient.post<any>(this.urlEndPoints.StepSaveCompanyInformation, formData,  { withCredentials: true });
    return this.httpClient.post<any>(this.urlEndPoints.StepSaveKeyEmployee, formData);
  }

}
