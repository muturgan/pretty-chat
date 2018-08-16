import { Component, OnInit } from '@angular/core';
// import {Router} from '@angular/router';
import { SocketService } from '../socket.service';

type messageType = {
  id: number,
  name: string,
  status: string,
  password: null,
  date: number,
  room: string,
  text: string,
  author_id: number,
};

@Component({
  selector: 'app-chat',
  template: `
    <section data-component="chat" class="js-hidden">
      <fieldset class="main-fieldset">
        <legend class="main-legend">Pretty chat</legend>
        <button
          data-form="log-out-button"
          (click)="leaveChat()"
          routerLink=""
          tabindex="3"
            > \u25C0 Log-out
        </button>

        <div class="output-wrapper">
          <output> {{ chatComment }} </output>
        </div>

        <ul id="messagesList">
          <app-message
            *ngFor="let message of messages"
            [message]="message"
            [currentUser]="currentUser.name"
          ></app-message>
        </ul>

        <textarea
          #textarea
          (keydown)="checkKey($event, sendMessageButton)"
          tabindex="1"
          autofocus
        ></textarea>
        <button
          #sendMessageButton
          (click)="sendMessage(textarea.value.trim(), textarea)"
          tabindex="2"
            >Send message
        </button>
      </fieldset>
    </section>
  `,
  styleUrls: ['./chat.component.scss'],
})


export class AppChatComponent implements OnInit {
  private ul: HTMLUListElement;
  public messages: Array< messageType > = [];
  public currentUser: {
    id: number,
    name: string,
    status: string,
  };
  public chatComment = '';

  private click: MouseEvent = new MouseEvent('click');

  constructor(
    private _socketService: SocketService,
    // private _router: Router,
    ) {
        window.onunload = () => {
          this._socketService.emit('user leave', this.currentUser);
        };


        this._socketService.initChatResponse()
          .subscribe( (messages: Array<messageType>) => {
            (() => {
              let i = 0;
              const timerId = setInterval(() => {
                if (messages[i]) {
                  this.printMessage(messages[i]);
                } else {
                  clearInterval(timerId);
                }
                i++;
              }, 20);
            })();
          });

        this._socketService.messageFromServer()
          .subscribe( (message: messageType) => {
            this.printMessage(message);
          });

        this._socketService.userConnected()
          .subscribe( (userName: string) => {
            this.updateStatus(userName, 'online');
            this.chatComment = `${userName} is online`;
            setTimeout(() => { this.chatComment = ''; }, 1500);
          });


        this._socketService.userCreated()
          .subscribe( (userName: string) => {
            this.chatComment = `Welcome new user ${userName}!`;
            setTimeout(() => { this.chatComment = ''; }, 1500);
          });

        this._socketService.userLeave()
          .subscribe( (userName: string) => {
            this.updateStatus(userName, 'offline');
            this.chatComment = `${userName} is offline`;
            setTimeout(() => { this.chatComment = ''; }, 1500);
          });

        this._socketService.serverError()
          .subscribe( () => {
            this.chatComment = `A thousand apologies. We have a problem on server.`;
            setTimeout(() => { this.chatComment = ''; }, 1500);
          });
      }

  ngOnInit(): void {
    this.currentUser = this._socketService.getCurrentUser();
    this._socketService.emit('initChat', this.currentUser.id);
    this.ul = document.body.querySelector('#messagesList');
  }

  public checkKey(event, sendMessageButton: HTMLButtonElement): void {
    if ((event.keyCode === 13) && (!event.shiftKey)) {
      sendMessageButton.dispatchEvent(this.click);
    }
  }

  public sendMessage(text: string, textarea: HTMLTextAreaElement): void {
    if (text) {
      this._socketService.emit('messageFromClient', {text, author_id: this.currentUser.id});
    }
    textarea.value = null;
  }

  private printMessage(message: messageType): void {
    this.messages.push(message);

    setTimeout(() => {
      if ((this.ul.scrollHeight - this.ul.scrollTop) < 500) {
        this.ul.scrollTo(0, this.ul.scrollHeight);
      }
    }, 1);
  }

  public leaveChat(): void {
    this._socketService.emit('user leave', this.currentUser);
  }

  private updateStatus = (userName: string, status: string) => {
    for (let message of this.messages) {
      if (message.name === userName) {
        const updatedMessage = message;
        updatedMessage.status = status;
        message = updatedMessage;
      }
    }
  }

}
