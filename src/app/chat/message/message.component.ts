import { Component, OnInit, Input } from '@angular/core';
import { DateService } from './date.service';

@Component({
  selector: 'app-message',
  template: `
    <li>
      <span class="message-date"> {{ _dateService.prettierDate(message?.date) }}</span>
      <b [class]="message?.status"> • </b>
      <span [class]="messageAuthorship"> {{ message?.name }} </span>
      <p> {{ message?.text }} </p>
    </li>
  `,
  styleUrls: ['./message.component.scss'],
})


export class AppMessageComponent implements OnInit  {
  
  @Input() currentUser;
  @Input() message;
  
  public messageAuthorship:string = '';
  
  constructor(public _dateService: DateService) {}
  
  
  ngOnInit(): void {
    if (this.message.name === this.currentUser) {
      this.messageAuthorship = 'my-message';
    };
  }
  

}
