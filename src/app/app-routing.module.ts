import { NgModule }             from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppGreetingComponent } from './greeting/greeting.component';
import { AppSignUpComponent }   from './sign-up/sign-up.component';
import { AppSignInComponent }   from './sign-in/sign-in.component';
import { AppChatComponent }     from './chat/chat.component';

const routes: Routes = [
  {path: '', component: AppGreetingComponent},
  {path: 'sign-up', component: AppSignUpComponent},
  {path: 'sign-in', component: AppSignInComponent},
  {path: 'chat', component: AppChatComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
