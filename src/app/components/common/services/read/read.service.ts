import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReadService {

  baseUrl: string = environment.baseUrl;
  urlEndPoints : any = environment.urlEndPoints;
  redirectUrl!: string;

  constructor(private httpClient: HttpClient) { }


  getEscoEntity(escoEntityReq: any): Observable<any> {
    debugger;
    const url = `${this.baseUrl + '/' + this.getEscoEntity }?entity=${escoEntityReq.entity}&esco_id=${escoEntityReq.esco_id}`;
    console.log('buil url', url);
    return this.httpClient.get<any>(url).pipe(map(response=> {
      return response;
    }));  
  }


  //  getHikingTrails(planCode: any) {
  //   return this.httpClient.post<any>(this.baseUrl + this.urlEndPoints.getHikingList, { planCode }, { withCredentials: true })
  //   .pipe( map((response) => {
  //     return response;
  //   }));
  // }




}
