import { Component, OnInit, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
  
})
export class AppComponent{
  title = 'demo';
  // constructor(private authService: AuthService){}
  constructor(){};
  // ngOnInit() {
  //   this.authService.autoLogin();
  // }
  
}
