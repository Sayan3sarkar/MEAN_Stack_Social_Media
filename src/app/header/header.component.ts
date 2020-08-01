import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  private authStatusSubscriptor: Subscription;
  public isAuthenticated = false;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authStatusSubscriptor = this.authService.authStatusListener.subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated;
    });
  }

  public onLogout(): void {
    // Something
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.authStatusSubscriptor.unsubscribe();
  }

}
