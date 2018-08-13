import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from '../socket.service';
import { CookieService } from '../cookie.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class AppSignUpComponent {

  private _click: Event = new Event('click');

  public signUpComment = 'Please create your login and password';
  public commentStatus = 'alert alert-primary';

  constructor(
    private _socketService: SocketService,
    private _cookieService: CookieService,
    private _router: Router,
    ) {

        this._socketService.signUpSuccess()
          .subscribe( (user: {id: number, name: string, status: string}) => {
            this.signUpComment = `New user created. Wellcome ${user.name} :)`;
            this.commentStatus = 'alert alert-success';

            setTimeout(() => {
              this._router.navigate(['chat']);
            }, 1500);
          });


        this._socketService.signUpError()
          .subscribe( () => {
            this.signUpComment = `This login is taken. Create different please`;
            this.commentStatus = 'alert alert-danger';

            this._cookieService.deleteCookie('chatUser');
            this._cookieService.deleteCookie('chatPassword');
          });


        this._socketService.serverError()
          .subscribe( () => {
            this.signUpComment = `A thousand apologies. We have a problem on server.`;
            this.commentStatus = 'alert alert-warning';

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
      this.commentStatus = 'alert alert-danger';
    } else {
      this.signUpComment = 'Your personal data is being sent to the server. Wait a minute please.';
      this.commentStatus = 'alert alert-primary';

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
