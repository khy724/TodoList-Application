import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataStorageService } from '../data/data-storage.service';
import { HttpClient,HttpResponse ,HttpErrorResponse,HttpParams} from '@angular/common/http';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css']
})
export class TodosComponent implements OnInit{
  todos;
  inputTodo: Todo;
  iseditting=-1;
  constructor(private storage:DataStorageService,private authservice: AuthService ) { }

  ngOnInit(): void {
    
    // this.todos = this.storage.getTodos(JSON.parse(localStorage.getItem("userID")));
    console.log("ngoninit");
    this.storage.getTodos(JSON.parse(localStorage.getItem("userData")).userID).subscribe(
      (resp) =>{
        // console.log(resp);
        
          this.todos = resp;
        
        
         
        
      },
    (error)=>{
      console.log("gettodos");
      this.authservice.logout();
    }
      
    
    );

  
    
    // console.log(a);
    this.iseditting=-1;
  }
  
  OnDelete(id: number){
    // this.todos = JSON.parse(localStorage.getItem("todoData"));
    // this.todos.splice(id,1);
    // localStorage.removeItem("todoData");
    // localStorage.setItem("todoData" ,JSON.stringify( this.todos));
    // console.log(this.todos);
    this.storage.deleteTodo(this.todos[id]._id).subscribe(
      resp =>{
        
        // let id = this.todos.filter()
        this.todos.splice(id,1);
      }
    ); //how to get selfID???
  }
  OnEdit(id: number){
    // this.todos = JSON.parse(localStorage.getItem("todoData"));
    this.iseditting=id;
    this.inputTodo = this.todos[id].content;
    // this.storage.editTodo(this.todos[id].selfID);
    
  }
  OnCompleted(id:number){
    // this.todos = JSON.parse(localStorage.getItem("todoData"));

    this.todos[id].completed = true;
    this.storage.editTodo(this.todos[id]);
    // localStorage.removeItem("todoData");
    // localStorage.setItem("todoData" ,JSON.stringify( this.todos));
  }
  OnSave(id:number, form: NgForm){
    this.todos[id].content= form.value.editted;
    // console.log(form);
    let a= this.storage.editTodo(this.todos[id]);
    this.iseditting=-1;
    
    // localStorage.removeItem("todoData");
    // localStorage.setItem("todoData" ,JSON.stringify( this.todos));
  }
  OnAdd(form: NgForm){
    // console.log(form);
    const a= {
      userID: JSON.parse(localStorage.getItem("userData")).userID,
      content: form.value.inputTodo,
      completed: false,
      // date: Date.now(),
    };
    
    
    this.storage.addTodo(a).subscribe(
      resp => {
        console.log(resp);
        this.todos.push(resp);
      }
    );
    // console.log(todo);
    // this.todos.push(todo);
    
    // console.log(this.inputTodo);
    form.reset();
  }

}
export class Todo{
  _id : string;
  userID: string;
  content : string;
  completed : boolean;
  date : string;
}
