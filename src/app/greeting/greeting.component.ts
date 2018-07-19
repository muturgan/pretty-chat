import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from '../cookie.service';

@Component({
  selector: 'app-greeting',
  template: `
    <section data-component="greeting-field">
      <fieldset class="main-fieldset">
        <legend class="main-legend">Welcome!</legend>
        <div>
          Welcome to our pretty chat. Introduce yourself please.
        </div>

        <button
          data-form="choose-sign-up-button"
          routerLink="sign-up"
            >Sign-up
        </button>
        <button
          data-form="choose-sign-in-button"
          routerLink="sign-in"
            >Sign-in
        </button>
      </fieldset>
    </section>
  `,
  styleUrls: ['./greeting.component.scss']
})
export class AppGreetingComponent implements OnInit {

  constructor(
    private _router: Router,
    private _cookieService: CookieService,
  ) {}

  ngOnInit() {
    if (
      this._cookieService.getCookie('chatUser')
      && this._cookieService.getCookie('chatPassword')
    ) {
        this._router.navigate(['sign-in']);
      }
  }

}
