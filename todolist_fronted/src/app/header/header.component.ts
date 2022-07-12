// import { style } from '@angular/animations';
import { Component, OnInit, OnDestroy, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

// import { DataStorageService } from '../shared/data-storage.service';
// import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  
})
export class HeaderComponent implements OnInit, OnChanges{
  // isAuthenticated = false;
  private userSub: Subscription;

  constructor(
    // private dataStorageService: DataStorageService,
    private authService: AuthService, private router: Router
  ) {}

  // ngOnInit() {
  //   this.userSub = this.authService.user.subscribe(user => {
  //     this.isAuthenticated = !!user;
  //     console.log(!user);
  //     console.log(!!user);
  //   });
  // }
  isloggedin:boolean = this.authService.isloggedin;
  // @Output() isloggedin= new EventEmitter<boolean>();
  ngOnInit(): void {
    const u = JSON.parse(localStorage.getItem("userData"));
    if(u){
        this.isloggedin = true;
    }
    else{
        this.isloggedin = false;
    }
    this.userSub = this.authService.isloggedinChange.subscribe(user => {
      this.isloggedin = !!user;
      // console.log(!user);
      // console.log(!!user);
    });
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    // const u = JSON.parse(localStorage.getItem("userData"));
    // if(u){
    //     this.isloggedin = u.loggedin;
    // }
    // else{
    //     this.isloggedin = false;
    // }
  }
  
  OnLogout(){
      this.authService.logout();
      this.isloggedin = false;
      this.router.navigate(['/auth']);
  }
  // onSaveData() {
  //   this.dataStorageService.storeRecipes();
  // }

  // onFetchData() {
  //   this.dataStorageService.fetchRecipes().subscribe();
  // }

  // onLogout() {
  //   this.authService.logout();
  // }

  // ngOnDestroy() {
  //   // this.userSub.unsubscribe();
  // }
}
