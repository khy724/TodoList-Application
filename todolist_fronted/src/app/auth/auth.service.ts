import { EventEmitter, Injectable, OnInit, Output } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, tap,map } from 'rxjs/operators';
import { throwError,Subject,BehaviorSubject } from 'rxjs';
import {userprofile} from './auth.component';
import { User } from './user.model';
import { DataStorageService } from '../data/data-storage.service';
import { AuthInterceptorService } from './auth-interceptor.service';

export interface AuthResponseData {
  // kind: string;
  // idToken: string;
  email: string;
  accesstoken: string;
  refreshtoken: string;
  
  password: string;
  // expiresIn: string;
  _id: string;
  // registered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService implements OnInit{
  user = new BehaviorSubject<User>(null);
  // private tokenExpirationTimer: any;

  isloggedin:boolean;
  
  isloggedinChange: Subject<boolean> = new Subject<boolean>();

  constructor( private router: Router,private http:HttpClient) {
    this.isloggedinChange.subscribe((value) => {
      this.isloggedin = value
  });
    
  }
  
  ngOnInit(): void {
    const u = JSON.parse(localStorage.getItem("userData"));
    if(u){
        this.isloggedin = true;
    }
    else{
        this.isloggedin = false;
    }
  }
  signup(email: string, password: string) {
    this.isloggedinChange.next(!this.isloggedin);
    console.log("inside signup");
    return this.http
      .post<AuthResponseData>(
        'https://7e0dqkd843.execute-api.ap-south-1.amazonaws.com/dev/api/users',
        // '/api/users',
        {
          email: email,
          password: password,
          // returnSecureToken: true
        }
      )
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          
          this.handleAuthentication(
            resData.email,
            resData._id,
            resData.password,
            resData.accesstoken,
            resData.refreshtoken
          );
          // return resData;
          
        })
      );
      
      // const u:userprofile = {
      //   email : email,
      //   password : password,
      //   loggedin : true
      // };
      // const a = this.storage.store(u);
      // // this.isloggedin = true;
      
      
      // localStorage.setItem("userID",a.userID)
      // this.router.navigate(['/todos']);
      
      // localStorage.setItem("userData",JSON.stringify(u));
      // this.router.navigate['/todos'];
      // console.log("todo");
      // return u;
  }
  renewAT(user){
    this.http.post('https://7e0dqkd843.execute-api.ap-south-1.amazonaws.com/dev/api/users/renewAT',user).subscribe(
      // this.http.post('/api/users/renewAT',user).subscribe(
      resp =>{
        user.accesstoken = resp;
        localStorage.removeItem("userData");
        localStorage.setItem("userData",user);
      },
      error =>{
        localStorage.removeItem("userData");
      }
      
    );
  }
  login(email: string, password: string) {
    // let a:string;
    this.isloggedinChange.next(!this.isloggedin);
    return this.http
      .post<AuthResponseData>(
        'https://7e0dqkd843.execute-api.ap-south-1.amazonaws.com/dev/api/users/login',
        // '/api/users/login',
        {
          email: email,
          password: password,
          // returnSecureToken: true
        }
      )
      .pipe(
        catchError(this.handleError),
        map(resData => {
          
          this.handleAuthentication(
            resData.email,
            resData._id,
            resData.password,
            resData.accesstoken,
            resData.refreshtoken
          );
          
        })
      );
      // return a;
      
    // const u = this.storage.fetch("userData");
    // if(u.email=== email && u.password===password){
    //   u.loggedin = true;
    //   this.storage.store("userData",u);
    //   // this.isloggedin = true;
    //   this.isloggedinChange.next(!this.isloggedin);
      
    //   this.router.navigate(['/todos']);
    //   return "";
      
    // } 
    // else{
    //   this.isloggedin = false;
    //   // error
    //   // return null;
    //   return "Please enter correct login credentials!"

    // }
    
  }

  autoLogin() {
    // const userData: {
    //   email: string;
    //   id: string;
    //   _token: string;
    //   _tokenExpirationDate: string;
    // } = JSON.parse(localStorage.getItem('userData'));
    // if (!userData) {
    //   return;
    // }

    // const loadedUser = new User(
    //   userData.email,
    //   userData.id,
    //   userData._token,
    //   new Date(userData._tokenExpirationDate)
    // );

    // if (loadedUser.token) {
    //   this.user.next(loadedUser);
    //   const expirationDuration =
    //     new Date(userData._tokenExpirationDate).getTime() -
    //     new Date().getTime();
    //   this.autoLogout(expirationDuration);
    // }
    

  }

  logout() {
    this.user.next(null);
    // console.log("logout");
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    this.isloggedinChange.next(false);
    AuthInterceptorService.accessToken="";
    // const u = this.storage.fetch("userData");
    // u.loggedin = false;
    // this.storage.delete("userData");
    // // localStorage.removeItem("userData");
    // this.storage.store("userData",u);
    // // this.isloggedin = false;
    // this.isloggedinChange.next(false);
    // // localStorage.setItem("userData",JSON.stringify(u))
    // this.router.navigate(['/auth']);
    
  }

  autoLogout(expirationDuration: number) {
    
    
  }

  private handleAuthentication(
    email: string,
    userId: string,
    password: string,
    accesstoken: string,
    refreshtoken: string
    // expiresIn: number
  ) {

    // const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = {'userID': userId,'email':email,'password':password ,'refreshtoken':refreshtoken};
    AuthInterceptorService.accessToken = accesstoken;
    // console.log(user);
    // AuthInterceptorService.accessToken=accesstoken;
    // this.user.next(user);
    // this.autoLogout(expiresIn * 1000);
    
    localStorage.setItem('userData', JSON.stringify(user));
    let a = localStorage.getItem("userData");
    
    this.router.navigate(['/todos']);
    console.log("handle auth");
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    // console.log(errorRes.error);
    // if (!errorRes.error || !errorRes.error.error) {
    //   return throwError(errorMessage);
    // }
    errorMessage = errorRes.error;
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}
