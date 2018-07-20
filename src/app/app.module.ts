import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { MDBBootstrapModule } from 'angular-bootstrap-md';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppGreetingComponent } from './greeting/greeting.component';
import { AppSignUpComponent } from './sign-up/sign-up.component';
import { AppSignInComponent } from './sign-in/sign-in.component';
import { AppChatComponent } from './chat/chat.component';
import { AppMessageComponent } from './chat/message/message.component';
import { SocketService } from './socket.service';
import { CookieService } from './cookie.service';
import { DateService } from './chat/message/date.service';

@NgModule({
  declarations: [
    AppComponent,
    AppGreetingComponent,
    AppSignUpComponent,
    AppSignInComponent,
    AppChatComponent,
    AppMessageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MDBBootstrapModule.forRoot()
  ],
  providers: [SocketService, CookieService, DateService],
  bootstrap: [AppComponent],
  schemas: [ NO_ERRORS_SCHEMA ]
})
export class AppModule {}
