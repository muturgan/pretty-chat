import { Injectable } from '@angular/core';
import { pairwise, filter } from 'rxjs/operators';
import { Router, RouterEvent, NavigationEnd } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RouterService {

  private _previousRoute: string;

  constructor(private _router: Router) {
    this._router.events.pipe<RouterEvent>(
      filter((event) => event instanceof NavigationEnd),
      pairwise()
        ).subscribe((pair) => {
          this._previousRoute = pair[0].url;
        });
  }

  public getPreviousRout(): string {
    return this._previousRoute;
  }

}
