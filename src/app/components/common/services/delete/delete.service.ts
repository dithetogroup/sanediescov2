import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DeleteService {

  urlEndPoints : any = environment.urlEndPoints;
  redirectUrl!: string;

  constructor(private httpClient: HttpClient, private router: Router) { }


  StepDeletePreviousProject(pp_id: number) {
    const formData = new FormData();
    formData.append('pp_id', pp_id.toString());
    return this.httpClient.post<any>(this.urlEndPoints.StepDeletePreviousProject, formData);
  }
  
}
