import { Component } from '@angular/core';
import { AppRoutingModule } from '../app-routing.module';

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
export class AppGreetingComponent {}