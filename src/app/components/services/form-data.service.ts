import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormDataService {

  constructor(private http: HttpClient) {}

  submitPreviousProjects(data: any) {
    return this.http.post('http://localhost:8000/api/previous-projects', data, { withCredentials: true });
  }


  submitEnergyServiceOffered(data: any) {
    return this.http.post('http://localhost:8000/api/service-offered', data, { withCredentials: true });
  }


  companyInformation(data: any) {
    return this.http.post('http://localhost:8000/api/company-information', data, { withCredentials: true });
  }

  // Similarly create methods for key employees, services, company info, technology
}
