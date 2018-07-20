import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from '../socket.service';
import { CookieService } from '../cookie.service';

@Component({
  selector: 'app-sign-in',
  template: `
    <section data-component="sign-in-field" class="js-hidden">
      <fieldset class="main-fieldset">
        <legend class="main-legend">Sign-in form</legend>
        <button
          data-form="sign-in-back-button"
          routerLink=""
          fragment="sign-in"
          tabindex="4"
          class="btn btn-deep-purple waves-light"
          mdbWavesEffect
            > \u25C0 Back to main page
        </button>

        <fieldset class="item-fieldset">
          <legend>Login</legend>
          <input
            #loginFielf
            type="text"
            (keydown)="checkKey($event.keyCode, signInButton)"
            tabindex="1"
            autofocus
          >
        </fieldset>

        <fieldset class="item-fieldset">
          <legend>Password</legend>
          <input
            #passwordField
            type="password"
            (keydown)="checkKey($event.keyCode, signInButton)"
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
          (click)="checkForm(loginFielf.value, passwordField.value, checkbox)"
          tabindex="3"
          class="btn btn-deep-purple waves-light"
          mdbWavesEffect
            >Sign-in
        </button>
        <br>

        <input #checkbox type="checkbox" checked> <span>remember me</span>
      </fieldset>
    </section>
  `,
  styleUrls: ['./sign-in.component.scss']
})
export class AppSignInComponent implements OnInit {

  @ViewChild('loginFielf') private _loginFielf: ElementRef;
  @ViewChild('passwordField') private _passwordField: ElementRef;

  private _click: Event = new Event('click');

  public signInComment = 'Please enter your login and password';
  public commentStatus = 'js-neutral';

  constructor(
    private _socketService: SocketService,
    private _cookieService: CookieService,
    private _router: Router,
    ) {

        this._socketService.signInSuccess()
          .subscribe( (user: {id: number, name: string, status: string}) => {
            this.signInComment = `Login and password are correct. Welcome ${user.name} :)`;
            this.commentStatus = 'js-success';

            setTimeout(() => {
              this._router.navigate(['chat']);
            }, 1500);
          });


        this._socketService.signInError()
          .subscribe( () => {
            this.signInComment = 'Login or password incorrect. Please try again';
            this.commentStatus = 'js-warning';

            this._cookieService.deleteCookie('chatUser');
            this._cookieService.deleteCookie('chatPassword');
          });


        this._socketService.serverError()
          .subscribe( () => {
            this.signInComment = `A thousand apologies. We have a problem on server.`;
            this.commentStatus = 'js-warning';

            this._cookieService.deleteCookie('chatUser');
            this._cookieService.deleteCookie('chatPassword');
          });
      }

  ngOnInit() {
    const login = this._cookieService.getCookie('chatUser');
    const password = this._cookieService.getCookie('chatPassword');
    if (login && password) {
      this._loginFielf.nativeElement.value = login;
      this._passwordField.nativeElement.value = password;
    }
  }



  public checkKey(keyCode: number, signInButton): void {
    if (keyCode === 13) { // Enter
      signInButton.dispatchEvent(this._click);
    }
  }

  public checkForm(login: string, password: string, checkbox: HTMLInputElement): void {
    if ( (login === '') || (password === '') ) {
      this.signInComment = 'Fields "Login" and "Password" are required.';
      this.commentStatus = 'js-warning';
    } else {
      this.signInComment = `Your personal data is being sent to the server. Wait a minute please.`;
      this.commentStatus = 'js-neutral';

      if (checkbox.hasAttribute('checked')) {
        this._cookieService.setCookie('chatUser', login);
        this._cookieService.setCookie('chatPassword', password);
      }

      this._initSignIn(login, password);
    }
  }

  private _initSignIn(login: string, password: string): void {
    this._socketService.emit('initSignIn', {name: login, password: password});
  }

}
