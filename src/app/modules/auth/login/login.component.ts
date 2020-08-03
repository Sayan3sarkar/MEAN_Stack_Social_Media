import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  public form: FormGroup;
  public isLoading = false;
  private authStatusSubscriptor: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authStatusSubscriptor = this.authService.authStatusListener.subscribe(authStatus => {
      this.isLoading = false;
    });
    this.initForm();
  }

  public initForm(): void {
    this.form = new FormGroup({
      email : new FormControl('', [Validators.required, Validators.email]),
      password : new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(15)])
    });
  }

  public onLogin(): void {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.login(this.form.get('email').value, this.form.get('password').value);
  }

  ngOnDestroy() {
    this.authStatusSubscriptor.unsubscribe();
  }

}
