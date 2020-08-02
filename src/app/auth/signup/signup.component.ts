import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {

  constructor(private authService: AuthService) { }

  public form: FormGroup;
  public isLoading = false;
  private authStatusSubscriptor: Subscription;

  ngOnInit(): void {
    this.authStatusSubscriptor = this.authService.authStatusListener.subscribe(authStatus => {
      this.isLoading = false;
    });
    this.initForm();
  }

  public initForm(): void {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      passwords: new FormGroup({
        password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(15)]),
        confirmPassword: new FormControl('',
        [Validators.required, Validators.minLength(8), Validators.maxLength(15)])
      }, {
        validators: group => group.value.password === group.value.confirmPassword ? null : {unmatched: true}
      })
    });
  }

  public checkPasswordMatch(): boolean {
    return this.form.get('passwords.password').valid
      && this.form.get('passwords.confirmPassword').valid
      && this.form.get('passwords').invalid;
  }

  public onSignUp(): void {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.createUser(
      this.form.get('email').value,
      this.form.get('passwords.password').value,
      this.form.get('passwords.confirmPassword').value
    );
  }

  ngOnDestroy() {
    this.authStatusSubscriptor.unsubscribe();
  }

}
