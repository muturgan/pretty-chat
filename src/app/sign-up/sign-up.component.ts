import { Component } from '@angular/core';
import {Router} from '@angular/router';
import { SocketService } from '../socket.service';

@Component({
  selector: 'app-sign-up',
  template: `
    <section data-component="sign-up-field" class="js-hidden">
      <fieldset class="main-fieldset">
        <legend class="main-legend">Sign-up form</legend>
        <button
          data-form="sign-up-back-button"
          routerLink=""
          tabindex="5"
            > \u25C0 Back to main page
        </button>
        
        <fieldset class="item-fieldset">
          <legend>Login</legend>
          <input
            type="text"
            (keydown)="checkKey($event.keyCode, signUpButton)"
            #loginFielf
            tabindex="1"
            autofocus
          >
        </fieldset>
        
        <fieldset class="item-fieldset">
          <legend>Password</legend>
          <input
            type="password"
            (keydown)="checkKey($event.keyCode, signUpButton)"
            #passwordField
            tabindex="2"
          >
        </fieldset>
        
        <fieldset class="item-fieldset">
          <legend>Confirm password</legend>
          <input
            type="password"
            (keydown)="checkKey($event.keyCode, signUpButton)"
            #confirmPasswordField
            tabindex="3"
          >
        </fieldset>
        
        <div class="output-wrapper">
          <output
            data-form="sign-up-output"
            [class]="commentStatus"
              >{{ signUpComment }}
          </output>
        </div>
        
        <button
          #signUpButton
          (click)="checkForm(loginFielf.value, passwordField.value, confirmPasswordField.value)"
          tabindex="4"
            >Sign-up
        </button>
      </fieldset>
    </section>
  `,
  styleUrls: ['./sign-up.component.scss']
})
export class AppSignUpComponent {
  
  private click:Event = new Event("click");
  
  public signUpComment:string = 'Please create your login and password';
  public commentStatus:string = 'js-neutral';
  
  constructor(
    private _socketService: SocketService,
    private router: Router,
    ) {
        this._socketService.signUpSuccess()
          .subscribe( (user: {id:number, name:string, status:string}) => {
            this.signUpComment = `New user created. Wellcome ${user.name} :)`;
            this.commentStatus = 'js-success';
            
            
            setTimeout(() => {
              this.router.navigate(['chat']);
            }, 1500);
          });
          
        
        this._socketService.signUpError()
          .subscribe( () => {
            this.signUpComment = `This login is taken. Create different please`;
            this.commentStatus = 'js-warning';
          });
          
        
        this._socketService.serverError()
          .subscribe( () => {
            this.signUpComment = `A thousand apologies. We have a problem on server.`;
            this.commentStatus = 'js-warning';
          });
      }
      
      
      
  
  public checkKey(keyCode:number, signUpButton) {
    if (keyCode === 13) { //Enter
      signUpButton.dispatchEvent(this.click);
    }
  }
  
  public checkForm(login:string, password:string, confirmPassword:string) {
    if ( password !== confirmPassword ) {
      this.signUpComment = 'The entered values "Password" and "Confirm password" do not match. Try again please.';
      this.commentStatus = 'js-warning'
    } else {
      this.signUpComment = 'Your personal data is being sent to the server. Wait a minute please.';
      this.commentStatus = 'js-neutral'
      this.initSignUp(login, password);
    }
  }
  
  private initSignUp(login:string, password:string) {
    this._socketService.emit('initSignUp', {name: login, password: password});
  }

}