import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public form: FormGroup;
  public isLoading = false;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
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

}
