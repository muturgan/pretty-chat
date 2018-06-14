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
    let observable = new Observable<{id:Number, name:String, status:String}>((observer) => {
      this.socket.on('signInSuccess', (user) => {
        this.currentUser = user;
        observer.next(user);
      });
    });
    
    return observable;
  }
  
  public signInError() {
    let observable = new Observable((observer) => {
      this.socket.on('signInError', () => {
        observer.next();
      });
    });
    
    return observable;
  }
  
  
  public signUpSuccess() {
    let observable = new Observable<{id:Number, name:String, status:String}>((observer) => {
      this.socket.on('signUpSuccess', (user) => {
        this.currentUser = user;
        observer.next(user);
      });
    });
    
    return observable;
  }
  
  
  public signUpError() {
    let observable = new Observable((observer) => {
      this.socket.on('signUpError', () => {
        observer.next();
      });
    });
    
    return observable;
  }
  
  
  public serverError() {
    let observable = new Observable(observer  =>{
      this.socket.on('serverError', () => {
        observer.next();
      });
    });
    
    return observable;
  }
  
  
  public initChatResponse() {
    let observable = new Observable((observer) => {
      this.socket.on('initChatResponse', (messages) => {
        observer.next(messages);
      });
    });
    
    return observable;
  }
  
  public messageFromServer() {
    let observable = new Observable((observer) => {
      this.socket.on('messageFromServer', (message) => {
        observer.next(message);
      });
    });
    
    return observable;
  }
  
  public userConnected() {
    let observable = new Observable((observer) => {
      this.socket.on('user connected', (userName) => {
        observer.next(userName);
      });
    });
    
    return observable;
  }
  
  public userCreated() {
    let observable = new Observable((observer) => {
      this.socket.on('user created', (userName) => {
        observer.next(userName);
      });
    });
    
    return observable;
  }
  
  public userLeave() {
    let observable = new Observable((observer) => {
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
      this.socket= io();
    }
  };

}