import { HttpClient,HttpResponse ,HttpErrorResponse,HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { map, tap, take, exhaustMap ,catchError,switchMap} from 'rxjs/operators';
import { Todo } from '../todos/todos.component';
import { throwError,Subject,BehaviorSubject } from 'rxjs';
import { checkPreferences } from 'joi';
import {AuthInterceptorService} from '../auth/auth-interceptor.service'

;
export interface T{
  userID: string,
  content: string,
  completed: boolean,
  date: string,
}
@Injectable({
  providedIn: 'root'
})

export class DataStorageService {

  constructor(private http: HttpClient,private authService: AuthService) { }
  // store(data:any){
  //     // localStorage.setItem(key,JSON.stringify(data));
  // }
  // delete(key:string){
  //   localStorage.removeItem(key);
  // }
  // fetch(key:string){
  //   return JSON.parse(localStorage.getItem(key));
  // }
  // rootURL = '/api';
  getTodos(userID: string){
    // let queryParams = new HttpParams();
    // queryParams.append("id",userID);
    // console.log("sdgkb");
    // const accesstoken = JSON.parse(localStorage.getItem("userData")).accesstoken;
    const accesstoken = AuthInterceptorService.accessToken;
    // console.log(accesstoken);
     return this.http.get<Todo[]>(
      'https://7e0dqkd843.execute-api.ap-south-1.amazonaws.com/dev/api/todos/'+userID,{ headers: {'x-access-token': accesstoken} }
      // '/api/todos/'+userID,{ headers: {'x-access-token': accesstoken} }
    ).pipe(
      catchError(this.handleError)
    );
    
  }
  deleteTodo(selfID: string){
    // let queryParams = new HttpParams();
    // queryParams.append("id",selfID);
    const accesstoken = AuthInterceptorService.accessToken;
    // const accesstoken = JSON.parse(localStorage.getItem("userData")).accesstoken;
    return this.http.delete('https://7e0dqkd843.execute-api.ap-south-1.amazonaws.com/dev/api/todos/'+selfID ,{ headers: {'x-access-token': accesstoken} }).pipe(
      // return this.http.delete('/api/todos/'+selfID ,{ headers: {'x-access-token': accesstoken} }).pipe(
      catchError(this.handleError)
    );
  }
  editTodo(todo: Todo){
    // let queryParams = new HttpParams();
    // queryParams.append("id",todo._id);
    const accesstoken = AuthInterceptorService.accessToken;
    // const accesstoken = JSON.parse(localStorage.getItem("userData")).accesstoken;
    return this.http.put<Todo>(
      'https://7e0dqkd843.execute-api.ap-south-1.amazonaws.com/dev/api/todos/'+todo._id, todo,{ headers: {'x-access-token': accesstoken} }
      // '/api/todos/'+todo._id, todo,{ headers: {'x-access-token': accesstoken} }
    ).subscribe(response =>{
        console.log(response);
    });
    // return a;
  }
  addTodo(todo){
    // console.log(todo);
    const accesstoken = AuthInterceptorService.accessToken;
    // const accesstoken = JSON.parse(localStorage.getItem("userData")).accesstoken;
    return this.http.post<T>(
      'https://7e0dqkd843.execute-api.ap-south-1.amazonaws.com/dev/api/todos',{
        // '/api/todos',{
        userID: todo.userID,
        content: todo.content,
        
        // completed: todo.completed,
      },{ headers: {'x-access-token': accesstoken} }
    ).pipe(
      catchError(this.handleError),
      
    );
    
  }
  
  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    // if (!errorRes.error || !errorRes.error.error) {
    //   return throwError(errorMessage);
    // }
    errorMessage = errorRes.error;
    // console.log(errorMessage);
    
    let user = JSON.parse(localStorage.getItem("userData"));
    
    if(errorRes.error==="Invalid token."){
      
        // return this.http.post('/api/users/renewAT',user).pipe(
        //   switchMap((res:any)=>{
        //       user.accesstoken = res.accesstoken;
        //       localStorage.removeItem("userData");
        //       localStorage.setItem("userData",user);
        //       return 
        //   }),
        // );
    }
    return throwError(errorMessage);
  }
  // handleError(error){
  //   console.log(error);
  // }
}
