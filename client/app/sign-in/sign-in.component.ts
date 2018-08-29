import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from '../socket.service';
import { CookieService } from '../cookie.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class AppSignInComponent implements OnInit {

  @ViewChild('loginFielf') private _loginFielf: ElementRef;
  @ViewChild('passwordField') private _passwordField: ElementRef;

  private _click: Event = new Event('click');

  public signInComment = 'Please enter your login and password';
  public commentStatus = 'alert alert-primary';

  constructor(
    private _socketService: SocketService,
    private _cookieService: CookieService,
    private _router: Router,
    ) {

        this._socketService.signInSuccess()
          .subscribe( (user: {id: number, name: string, status: string}) => {
            this.signInComment = `Login and password are correct. Welcome ${user.name} :)`;
            this.commentStatus = 'alert alert-success';

            setTimeout(() => {
              this._router.navigate(['chat']);
            }, 1500);
          });


        this._socketService.signInError()
          .subscribe( () => {
            this.signInComment = 'Login or password incorrect. Please try again';
            this.commentStatus = 'alert alert-danger';

            this._cookieService.deleteCookie('chatUser');
            this._cookieService.deleteCookie('chatPassword');
          });


        this._socketService.serverError()
          .subscribe( () => {
            this.signInComment = `A thousand apologies. We have a problem on server.`;
            this.commentStatus = 'alert alert-warning';

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
      this.commentStatus = 'alert alert-danger';
    } else {
      this.signInComment = `Your personal data is being sent to the server. Wait a minute please.`;
      this.commentStatus = 'alert alert-primary';

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
