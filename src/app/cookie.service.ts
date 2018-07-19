import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CookieService {

  private _options: string;

  constructor() {
    this._options = `path=/; expires=${new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 30 * 2 /* 2 месяца */)}`;
  }

  public getCookie(key?: string): string {
    if (key) {
      const matches = document.cookie.match(new RegExp(
        '(?:^|; )' + key.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'
      ));

      if (matches) {
        return decodeURIComponent(matches[1]);
      } else {
        return;
      }
    }
    return document.cookie;
  }

  public setCookie(key: string, value: string): void {
    document.cookie = `${key}=${value}; ${this._options}`;
  }

  public deleteCookie(key: string): void {
    document.cookie = `${key}=; expires=${new Date(0)}`;
  }

}
