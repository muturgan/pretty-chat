import { Component } from '@angular/core';
import {Router} from '@angular/router';
import { SocketService } from '../socket.service';

@Component({
  selector: 'app-sign-in',
  template: `
    <section data-component="sign-in-field" class="js-hidden">
      <fieldset class="main-fieldset">
        <legend class="main-legend">Sign-in form</legend>
        <button
          data-form="sign-in-back-button"
          routerLink=""
          tabindex="4"
            > \u25C0 Back to main page
        </button>
        
        <fieldset class="item-fieldset">
          <legend>Login</legend>
          <input
            type="text"
            (keydown)="checkKey($event.keyCode, signInButton)"
            #loginFielf
            tabindex="1"
            autofocus
          >
        </fieldset>
        
        <fieldset class="item-fieldset">
          <legend>Password</legend>
          <input
            type="password"
            (keydown)="checkKey($event.keyCode, signInButton)"
            #passwordField
            tabindex="2"
          >
        </fieldset>
        
        <div class="output-wrapper">
          <output
            data-form="sign-in-output"
            [class]="commentStatus"
              >{{ signInComment }}
          </output>
        </div>
        
        <button
          #signInButton
          (click)="checkForm(loginFielf.value, passwordField.value)"
          tabindex="3"
            >Sign-in
        </button>
      </fieldset>
    </section>
  `,
  styleUrls: ['./sign-in.component.scss']
})
export class AppSignInComponent {
  
  private click:Event = new Event("click");
  
  public signInComment:string = 'Please enter your login and password';
  
  public commentStatus:string = 'js-neutral';
  
  constructor(
    private _socketService: SocketService,
    private router: Router,
    ) {
        this._socketService.signInSuccess()
          .subscribe( (user: {id:number, name:string, status:string}) => {
            this.signInComment = `Login and password are correct. Welcome ${user.name} :)`;
            this.commentStatus = 'js-success';
            
            
            setTimeout(() => {
              this.router.navigate(['chat']);
            }, 1500);
          });
          
        
        this._socketService.signInError()
          .subscribe( () => {
            this.signInComment = 'Login or password incorrect. Please try again';
            this.commentStatus = 'js-warning';
          });
          
        
        this._socketService.serverError()
          .subscribe( () => {
            this.signInComment = `A thousand apologies. We have a problem on server.`;
            this.commentStatus = 'js-warning';
          });
      }
      
      
      
  
  public checkKey(keyCode:number, signInButton) {
    if (keyCode === 13) { //Enter
      signInButton.dispatchEvent(this.click);
    }
  }
  
  public checkForm(login:string, password:string) {
    if ( (login === '') || (password === '') ) {
      this.signInComment = 'Fields "Login" and "Password" are required.';
      this.commentStatus = 'js-warning'
    } else {
      this.signInComment = `Your personal data is being sent to the server. Wait a minute please.`;
      this.commentStatus = 'js-neutral'
      this.initSignIn(login, password);
    }
  }
  
  private initSignIn(login:string, password:string) {
    this._socketService.emit('initSignIn', {name:login, password:password});
  }

}