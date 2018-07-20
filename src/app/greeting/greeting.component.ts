import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterEvent } from '@angular/router';
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
          class="btn btn-deep-purple waves-light"
          mdbWavesEffect
            >Sign-up
        </button>
        <button
          data-form="choose-sign-in-button"
          routerLink="sign-in"
          class="btn btn-deep-purple waves-light"
          mdbWavesEffect
            >Sign-in
        </button>
      </fieldset>
    </section>
  `,
  styleUrls: ['./greeting.component.scss']
})
export class AppGreetingComponent implements OnInit {

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _cookieService: CookieService,
  ) {
      // this._router.events.pairwise().subscribe((event: RouterEvent) => {
      //   console.log(event);
      // });

      this._route.params.subscribe((params) => {
        console.log('params:');
        console.log(params);
      });
    }

  ngOnInit() {
    // if (
    //   this._cookieService.getCookie('chatUser')
    //   && this._cookieService.getCookie('chatPassword')
    // ) {
    //     this._router.navigate(['sign-in']);
    //   }
  }

}
