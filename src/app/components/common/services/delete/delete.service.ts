import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DeleteService {
  StepDeletePreviousProject(pp_id: number) {
    const formData = new FormData();
    formData.append('pp_id', pp_id.toString());
    return this.httpClient.post<any>(this.urlEndPoints.StepDeletePreviousProject, formData);
  }
  urlEndPoints : any = environment.urlEndPoints;
  redirectUrl!: string;

  constructor(private httpClient: HttpClient, private router: Router) { }

  StepDeleteClientReferences(cr_id: number, esco_id: string) {
    const formData = new FormData();
    formData.append('cr_id', cr_id.toString());
    formData.append('esco_id', esco_id);
    return this.httpClient.post<any>(this.urlEndPoints.StepDeleteClientReferences, formData);
  }


  // delete.service.ts
  StepDeleteKeyEmployee(ke_id: number, esco_id: string) {
    const formData = new FormData();
    formData.append('ke_id', ke_id.toString());
    formData.append('esco_id', esco_id);
    return this.httpClient.post<any>(this.urlEndPoints.StepDeleteKeyEmployee, formData);
  }

  StepDeleteEmployeeFile(fileId: number) {
    // Assumes soft delete endpoint
    return this.httpClient.post<any>(this.urlEndPoints.StepDeleteEmployeeFile, { fu_id: fileId });
  }

  
  StepDeleteTechnologyClassification(fileId: number) {
    // Assumes soft delete endpoint
    return this.httpClient.post<any>(this.urlEndPoints.StepDeleteTechnologyClassification, { fu_id: fileId });
  }


  // delete.service.ts
  StepDeleteKeyEmployee(ke_id: number, esco_id: string) {
    const formData = new FormData();
    formData.append('ke_id', ke_id.toString());
    formData.append('esco_id', esco_id);
    return this.httpClient.post<any>(this.urlEndPoints.StepDeleteKeyEmployee, formData);
  }

  StepDeleteEmployeeFile(fileId: number) {
    // Assumes soft delete endpoint
    return this.httpClient.post<any>(this.urlEndPoints.StepDeleteEmployeeFile, { fu_id: fileId });
  }

  
}
