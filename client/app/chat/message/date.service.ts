import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DateService {

  public get prettierDate() {
    return this._prettierDate;
  }

  private _prettierDate(date: number): string {
    const now: number = Date.now();
    let dateString = '';
    const dateDifference: number = Date.now() - date;

    switch (true) {
      case ( (dateDifference < 86400000/*24 hours*/) && ((new Date(now)).getDate() === (new Date(date)).getDate()) ):
        dateString = `${(new Date(date)).getHours()}:${(new Date(date)).getMinutes()}`;
        if (dateString[1] === ':') {
          dateString = '0' + dateString;
        }
        if (dateString[4] === undefined) {
          dateString = dateString.substring(0, 3) + '0' + dateString.substring(3);
        }
        break;


      case ( (dateDifference < 86400000/*24 hours*/) && ((new Date(now)).getDate() !== (new Date(date)).getDate()) ):
        dateString = `yesterday`;
        break;

      case ( (dateDifference >= 86400000/*24 hours*/) && (dateDifference < 172800000/*48 hours*/) ):
        dateString = `a day ago`;
        break;

      case ( (dateDifference >= 172800000/*48 hours*/) && (dateDifference < 2419200000/*1 month*/) ):
        dateString = `${Math.round(dateDifference / 86400000) } days ago`;
        break;

      case ( (dateDifference >= 2419200000/*1 month*/) && (dateDifference < 31536000000/*1 year*/) ):
        dateString = `${Math.round(dateDifference / 2419200000) } months ago`;
        break;

      case ( dateDifference >= 31536000000/*1 year*/ ):
        dateString = `${Math.round(dateDifference / 31536000000) } years ago`;
        break;

      default:
        dateString = `${new Date(date) }`;
    }

    return dateString;
  }
}
