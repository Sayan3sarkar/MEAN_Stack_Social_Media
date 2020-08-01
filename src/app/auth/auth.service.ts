import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthData } from './auth-data.model';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  /**
   * User Signup method
   * @param --(email: string)
   * @param --(password: string)
   * @param --(confirmPassword: string)
   */
  public createUser(email: string, password: string, confirmPassword: string) {
    const authData: AuthData = {
      email,
      password,
      confirmPassword
    };
    this.http.post(`${environment.API_ENDPOINT_URL}/auth/signup`, authData)
      .subscribe(res => {
        console.log(res);
      });
  }
}
