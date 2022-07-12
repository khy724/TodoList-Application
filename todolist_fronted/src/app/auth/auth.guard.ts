import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree
} from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap, take } from 'rxjs/operators';

import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Promise<boolean | UrlTree>
    | Observable<boolean | UrlTree> {
    // return this.authService.user.pipe(
    //   take(1),
    //   map(user => {
    //     const isAuth = !!user;
    //     if (isAuth) {
    //       return true;
    //     }
    //     return this.router.createUrlTree(['/auth']);
    //   })
      // tap(isAuth => {
      //   if (!isAuth) {
      //     this.router.navigate(['/auth']);
      //   }
      // })
    // );
    const boo = JSON.parse(localStorage.getItem("userData"));
    if(boo){
      // console.log(boo.loggedin);
      // return this.router.navigate(['/todos']);
      // if(boo.loggedin)
      return true;
      // else
      // return this.router.navigate(['/auth']);

    }
    else{
      console.log("false");
      return this.router.navigate(['/auth']);
    }
    
  }
}
