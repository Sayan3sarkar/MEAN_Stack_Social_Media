import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

import { environment } from '@env/environment';
import { AuthData } from './auth-data.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token: string;
  public authStatusListener = new BehaviorSubject<boolean>(false);
  private tokenTimer: any;

  constructor(private http: HttpClient, private router: Router) { }

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
        this.router.navigate(['/login']);
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
      token: string,
      expiresIn: number
    }>(`${environment.API_ENDPOINT_URL}/auth/login`, {
      email,
      password
    }).subscribe(res => {
        console.log(res);
        this.token = res.token;
        if (this.token) {
          const expiresInDuration = res.expiresIn;
          this.tokenTimer = setTimeout(() => {
            this.logout();
          }, expiresInDuration * 1000);
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          this.saveAuthData(this.token, expirationDate);
          this.router.navigate(['/']);
        } else {
          this.authStatusListener.next(false);
          this.router.navigate(['/']);
        }
    });
  }

  /**
   * Logging out a user
   */
  public logout(): void {
    this.token = null;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  /**
   * Save Data to localStorage
   * @param --(token: string)
   * @param --(expirationDate: Date)
   */
  private saveAuthData(token: string, expirationDate: Date): void {
    localStorage.setItem('token', token);
    localStorage.setItem('expirationDate', expirationDate.toISOString());
  }

  /**
   * Remove Data from localStorage
   */
  private clearAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
  }
}
