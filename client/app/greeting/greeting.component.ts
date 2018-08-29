import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from '../cookie.service';
import { RouterService } from '../router.service';


@Component({
  selector: 'app-greeting',
  templateUrl: './greeting.component.html',
  styleUrls: ['./greeting.component.scss']
})
export class AppGreetingComponent implements OnInit {

  constructor(
    private _router: Router,
    private _cookieService: CookieService,
    private _routerService: RouterService,
  ) {}

  ngOnInit() {
    if (
      typeof this._routerService.getPreviousRout() !== 'string'
      && this._cookieService.getCookie('chatUser')
    ) {
      this._router.navigate(['sign-in']);
    }
  }

}
