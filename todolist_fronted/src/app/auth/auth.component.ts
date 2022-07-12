import { Component, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { AuthResponseData } from './auth.service';

export interface userprofile{
  email: string,
  password: string,
  loggedin: boolean,
}
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  // styleUrls: ['./todos.component.css']
  // providers: [AuthService],
})

export class AuthComponent{
  u:userprofile={
    email: "-",
    password: "-",
    loggedin: false,
  } ;
  isauth =false;
  
  isloggedin:boolean;
  isLoginMode = false;
  error: string = null;
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {
    this.isloggedin = authService.isloggedin;
    
  }
  // constructor(){}
  onSubmit(form : NgForm){
    if(!form.valid){
      
      return;
    }
    // let authObs: Observable<userprofile>;
    this.isLoading = true;
    if(this.isLoginMode){
      
       this.authService.login(form.value.email, form.value.password).subscribe(
         (resp)=>{
            this.error = null;
            this.isloggedin = true;
         },
         (error)=>{
           this.error = error;
           this.isloggedin = false;
         }
       );
      // const u = JSON.parse(localStorage.getItem("userData"));
      // this.u = u;
      // if(u.email=== form.value.email && u.password===form.value.password){
      //   u.loggedin = true;
      //   localStorage.setItem("userData",JSON.stringify(u));
      // } 
      // else{
      //   // error
      // }
      // this.isloggedin = this.authService.isloggedin;
    }
    else{
      this.authService.signup(form.value.email, form.value.password).subscribe(
        (resp)=>{
          this.error = null;
          this.isloggedin = true;
       },
       (error)=>{
         this.error = error;
         this.isloggedin = false;
       }
      );
      
      // this.u.email = form.value.email;
      // this.u.password = form.value.password;
      // this.u.loggedin = true;
      // localStorage.setItem("userData",JSON.stringify(this.u));
      this.isloggedin = this.authService.isloggedin;
    }
    // authObs.subscribe(
    //   resData => {
    //     console.log(resData);
    //     this.isLoading = false;
    //     this.router.navigate(['/todos']);
    //   },
    //   errorMessage => {
    //     console.log(errorMessage);
    //     this.error = errorMessage;
    //     this.isLoading = false;
    //   }
    // );

    form.reset();
  }

  onSwitchMode(){
    this.isLoginMode = !this.isLoginMode;
  }
}

// export class AuthComponent {
//   isLoginMode = true;
//   isLoading = false;
//   error: string = null;

//   constructor(private authService: AuthService, private router: Router) {}

//   onSwitchMode() {
//     this.isLoginMode = !this.isLoginMode;
//   }

//   onSubmit(form: NgForm) {
//     if (!form.valid) {
//       return;
//     }
//     const email = form.value.email;
//     const password = form.value.password;

//     let authObs: Observable<AuthResponseData>;

//     this.isLoading = true;

//     if (this.isLoginMode) {
//       authObs = this.authService.login(email, password);
//     } else {
//       authObs = this.authService.signup(email, password);
//     }

//     authObs.subscribe(
//       resData => {
//         console.log(resData);
//         this.isLoading = false;
//         this.router.navigate(['/todos']);
//       },
//       errorMessage => {
//         console.log(errorMessage);
//         this.error = errorMessage;
//         this.isLoading = false;
//       }
//     );

//     form.reset();
//   }
// }
