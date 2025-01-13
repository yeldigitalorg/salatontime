import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from './component/sections/nav-bar/nav-bar.component';
import  { FooterComponent } from './component/sections/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet, 
    NavBarComponent,
    FooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'salatontime-frontend';
}
