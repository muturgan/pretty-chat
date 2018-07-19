import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class SocketService {

  private socket = io();
  private currentUser = {
    id: 0,
    name: 'default',
    status: 'offline',
  };

  public getCurrentUser() {
    return this.currentUser;
  }


  public signInSuccess() {
    const observable = new Observable<{id: Number, name: String, status: String}>((observer) => {
      this.socket.on('signInSuccess', (user) => {
        this.currentUser = user;
        observer.next(user);
      });
    });

    return observable;
  }

  public signInError() {
    const observable = new Observable((observer) => {
      this.socket.on('signInError', () => {
        observer.next();
      });
    });

    return observable;
  }


  public signUpSuccess() {
    const observable = new Observable<{id: Number, name: String, status: String}>((observer) => {
      this.socket.on('signUpSuccess', (user) => {
        this.currentUser = user;
        observer.next(user);
      });
    });

    return observable;
  }


  public signUpError() {
    const observable = new Observable((observer) => {
      this.socket.on('signUpError', () => {
        observer.next();
      });
    });

    return observable;
  }


  public serverError() {
    const observable = new Observable((observer) => {
      this.socket.on('serverError', () => {
        observer.next();
      });
    });

    return observable;
  }


  public initChatResponse() {
    const observable = new Observable((observer) => {
      this.socket.on('initChatResponse', (messages) => {
        observer.next(messages);
      });
    });

    return observable;
  }

  public messageFromServer() {
    const observable = new Observable((observer) => {
      this.socket.on('messageFromServer', (message) => {
        observer.next(message);
      });
    });

    return observable;
  }

  public userConnected() {
    const observable = new Observable((observer) => {
      this.socket.on('user connected', (userName) => {
        observer.next(userName);
      });
    });

    return observable;
  }

  public userCreated() {
    const observable = new Observable((observer) => {
      this.socket.on('user created', (userName) => {
        observer.next(userName);
      });
    });

    return observable;
  }

  public userLeave() {
    const observable = new Observable((observer) => {
      this.socket.on('user leave', (userName) => {
        observer.next(userName);
      });
    });

    return observable;
  }

  public emit(event: string, data) {
    this.socket.emit(event, data);
    if (event === 'user leave') {
      this.currentUser = {
        id: 0,
        name: 'default',
        status: 'offline',
      };

      this.socket.disconnect();
      this.socket = io();
    }
  }

}
