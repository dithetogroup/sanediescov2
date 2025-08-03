import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UpdateService {


  urlEndPoints : any = environment.urlEndPoints;
  redirectUrl!: string;

  constructor(private httpClient: HttpClient) { }

  public StepUpdatePreviousProjects(formData: any) {
    //return this.httpClient.post<any>(this.urlEndPoints.StepSaveCompanyInformation, formData,  { withCredentials: true });
    return this.httpClient.post<any>(this.urlEndPoints.StepUpdatePreviousProjects, formData);
  }

}


