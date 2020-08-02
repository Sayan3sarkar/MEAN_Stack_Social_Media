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
  private userId: string;

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
   * @returns --(userId: string)
   */
  public getUserId() {
    return this.userId;
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
      expiresIn: number,
      userId: string
    }>(`${environment.API_ENDPOINT_URL}/auth/login`, {
      email,
      password
    }).subscribe(res => {
        console.log(res);
        this.token = res.token;
        if (this.token) {
          const expiresInDuration = res.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.userId = res.userId;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          this.saveAuthData(this.token, expirationDate, this.userId);
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
    this.userId = null;
    this.router.navigate(['/']);
  }

  /**
   * Utility method for Authentication timeout check
   * @param --(duration: timer)
   */
  private setAuthTimer(duration: number) {
    console.log('Setting Timer: ' + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  /**
   * Save Data to localStorage
   * @param --(token: string)
   * @param --(expirationDate: Date)
   * @param --(userId: string)
   */
  private saveAuthData(token: string, expirationDate: Date, userId: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('expirationDate', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  /**
   * Checks user authentication status on app starting/re-loading
   */
  public autoAuthUser() {
    const authInfo = this.getAuthData();
    if (!authInfo) {
      return;
    }
    const now = new Date();
    const expiresIn = authInfo.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInfo.token;
      this.userId = authInfo.userId;
      this.setAuthTimer(expiresIn / 1000); // since setAuthTimer() accepts duration parameter in seconds and expireIn is in milliseconds
      this.authStatusListener.next(true);
    }
  }

  /**
   * Remove Data from localStorage
   */
  private clearAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId');
  }

  /**
   * Get Data from localstorage
   * @returns --(null | { token: string, expirationDate: Date })
   */
  private getAuthData(): { token: string, expirationDate: Date, userId: string } | null {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expirationDate');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token,
      expirationDate: new Date(expirationDate),
      userId
    };
  }
}
