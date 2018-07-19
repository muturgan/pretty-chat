import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from '../socket.service';
import { CookieService } from '../cookie.service';

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
          (click)="checkForm(loginFielf.value, passwordField.value, confirmPasswordField.value, checkbox)"
          tabindex="4"
            >Sign-up
        </button>
        <br>

        <input #checkbox type="checkbox" checked> <span>remember me</span>
      </fieldset>
    </section>
  `,
  styleUrls: ['./sign-up.component.scss']
})
export class AppSignUpComponent {

  private _click: Event = new Event('click');

  public signUpComment = 'Please create your login and password';
  public commentStatus = 'js-neutral';

  constructor(
    private _socketService: SocketService,
    private _cookieService: CookieService,
    private _router: Router,
    ) {

        this._socketService.signUpSuccess()
          .subscribe( (user: {id: number, name: string, status: string}) => {
            this.signUpComment = `New user created. Wellcome ${user.name} :)`;
            this.commentStatus = 'js-success';

            setTimeout(() => {
              this._router.navigate(['chat']);
            }, 1500);
          });


        this._socketService.signUpError()
          .subscribe( () => {
            this.signUpComment = `This login is taken. Create different please`;
            this.commentStatus = 'js-warning';

            this._cookieService.deleteCookie('chatUser');
            this._cookieService.deleteCookie('chatPassword');
          });


        this._socketService.serverError()
          .subscribe( () => {
            this.signUpComment = `A thousand apologies. We have a problem on server.`;
            this.commentStatus = 'js-warning';

            this._cookieService.deleteCookie('chatUser');
            this._cookieService.deleteCookie('chatPassword');
          });
      }


  public checkKey(keyCode: number, signUpButton: HTMLElement): void {
    if (keyCode === 13) { // Enter
      signUpButton.dispatchEvent(this._click);
    }
  }

  public checkForm(login: string, password: string, confirmPassword: string, checkbox: HTMLInputElement): void {
    if ( password !== confirmPassword ) {
      this.signUpComment = 'The entered values "Password" and "Confirm password" do not match. Try again please.';
      this.commentStatus = 'js-warning';
    } else {
      this.signUpComment = 'Your personal data is being sent to the server. Wait a minute please.';
      this.commentStatus = 'js-neutral';

      if (checkbox.hasAttribute('checked')) {
        this._cookieService.setCookie('chatUser', login);
        this._cookieService.setCookie('chatPassword', password);
      }

      this._initSignUp(login, password);
    }
  }

  private _initSignUp(login: string, password: string): void {
    this._socketService.emit('initSignUp', {name: login, password: password});
  }

}
