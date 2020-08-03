import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PostListComponent } from '@modules/posts/post-list/post-list.component';
import { PostCreateComponent } from '@modules/posts/post-create/post-create.component';
import { LoginComponent } from '@modules/auth/login/login.component';
import { SignupComponent } from '@modules/auth/signup/signup.component';
import { AuthGuard } from '@modules/auth/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'post-list', pathMatch: 'full'},
  { path: 'post-list', component: PostListComponent },
  { path: 'post-create', component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: 'post-edit/:postId', component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
