import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthData } from './auth-data.model';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token: string;

  constructor(private http: HttpClient) { }

  /**
   * User Signup method
   * @param --(email: string)
   * @param --(password: string)
   * @param --(confirmPassword: string)
   */
  public createUser(email: string, password: string, confirmPassword: string): void {
    const authData: AuthData = {
      email,
      password,
      confirmPassword
    };
    this.http.post<{
      message: string,
      result: {
        _id: string,
        email: string,
        password?: string,
      }
    }>(`${environment.API_ENDPOINT_URL}/auth/signup`, authData)
      .subscribe(res => {
        console.log(res);
      });
  }

  /**
   * Returns the token
   * @returns --(token: string)
   */
  public getToken(): string {
    return this.token;
  }

  /**
   * User Login Method
   * @param --(email: string)
   * @param --(password: string)
   */
  public login(email: string, password: string): void {
    this.http.post<{
      message: string,
      token: string
    }>(`${environment.API_ENDPOINT_URL}/auth/login`, {
      email,
      password
    }).subscribe(res => {
      console.log(res);
      this.token = res.token;
    });
  }
}
