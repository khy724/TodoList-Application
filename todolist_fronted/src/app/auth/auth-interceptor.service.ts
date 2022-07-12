import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse, HttpClient
} from '@angular/common/http';
import {catchError, Observable, switchMap, throwError} from 'rxjs';

import { AuthService } from './auth.service';
import { Subscription } from 'rxjs';
// @Injectable()
// export class AuthInterceptorService implements HttpInterceptor {
//   constructor(private authService: AuthService) {}

//   intercept(req: HttpRequest<any>, next: HttpHandler) {
//     let user = JSON.parse(localStorage.getItem("userData"));
//     this.authService.renewAT(user);
//   }
// }
@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  static accessToken:string ;
  refresh = false;
  // userSub: Subscription;
  urlsToNotUse: Array<string>;
  // isloggedin:boolean;
  constructor(private authService: AuthService,private http:HttpClient) {
    this.urlsToNotUse= [
      'users',
      'users/login',
      
    ];
  }
  intercept(req: HttpRequest<any>,next:HttpHandler): Observable<HttpEvent<any>> {
    const no=false;
    if (this.isValidRequestForInterceptor(req.url)) {
      // if(no){
    return next.handle(req).pipe(catchError((err: HttpErrorResponse) => {
      // if(err.status===400 && !this.refresh){
      //   console.log("error 400");
      //         localStorage.removeItem("userData");
      //         this.authService.logout();
      // }
      // 
          if (err.status === 400 ) {
            console.log("call renewat");
            this.refresh = true;
            let user = JSON.parse(localStorage.getItem("userData"));
            return this.http.post('https://7e0dqkd843.execute-api.ap-south-1.amazonaws.com/dev/api/users/renewAT',user).pipe(
              // return this.http.post('/api/users/renewAT',user).pipe(
              switchMap((res: any) => {
                AuthInterceptorService.accessToken = res.accesstoken;
                if(res.status==="403"){
                  // console.log("interceptor error");
                  localStorage.removeItem("userData");
                  this.authService.logout();
                }
                if(res.status==="400"){
                  // console.log("interceptor error");
                  localStorage.removeItem("userData");
                  this.authService.logout();
                }
                if(res.status==="201"){
                  console.log("accesstoken renewed");
                  // let a=JSON.parse(localStorage.getItem("userData"));
                  // a.accesstoken = res.accesstoken;
                  // localStorage.setItem("userData",JSON.stringify(a));
                  AuthInterceptorService.accessToken = res.accesstoken;
                  return next.handle(req.clone({
                    setHeaders: {
                      'x-access-token':AuthInterceptorService.accessToken
                    }
                  }));
                }
                return next.handle(req.clone({
                  setHeaders: {
                    'x-access-token':AuthInterceptorService.accessToken
                  }
                }));
              }
              
              )
            );
          }
        
      this.refresh = false;
      return throwError(() => err);
    }));
  
    }
    
      console.log("here");
      return next.handle(req);
    
  }


  private isValidRequestForInterceptor(requestUrl: string): boolean {
    // console.log(requestUrl);
    // console.log("alsdgkjbj");
    let positionIndicator: string = 'api/';
    let position = requestUrl.indexOf(positionIndicator);
    if (position > 0) {
      let destination: string = requestUrl.substr(position + positionIndicator.length);
      for (let address of this.urlsToNotUse) {
        console.log(address);
        if (new RegExp(address).test(destination)) {
          return false;
        }
      }
    }
    return true;
  }
      
}



