import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = environment.baseUrl;
  private endPointsUrl = environment.endPointsUrl;
  private endPointsPage = environment.endPointPage;


  constructor(private http: HttpClient) {}

  login(credentials: any) {
    return this.http.post(`${this.endPointsUrl + this.endPointsPage.login}`, credentials, { withCredentials: true });
  }

  logout(): Observable<any> {
    return this.http.post(`${this.endPointsUrl + this.endPointsPage.logout}`, {}, { withCredentials: true });
  }

  testPing(): Observable<any> {
    return this.http.get('http://127.0.0.1:8000/api/ping', {
      withCredentials: true
    });
  }
  

  testConnection(): Observable<any> {
    return this.http.post(
      'http://localhost:8000/api/test',
      {},
      { withCredentials: true }
    );
  }

  testPingw(): Observable<any> {
    return this.http.get('http://localhost:8000/api/ping', {
      withCredentials: true
    });
  }



  


}
