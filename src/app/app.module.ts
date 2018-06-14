import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppGreetingComponent } from './greeting/greeting.component';
import { AppSignUpComponent } from './sign-up/sign-up.component';
import { AppSignInComponent } from './sign-in/sign-in.component';
import { AppChatComponent } from './chat/chat.component';
import { AppMessageComponent } from './chat/message/message.component';
import { SocketService } from './socket.service';
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
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}