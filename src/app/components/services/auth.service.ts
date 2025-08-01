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
  private endPointsPage = environment.endPointsUrl;


  constructor(private http: HttpClient) {}



}
