import { NgModule } from '@angular/core';
import { NgModel ,FormsModule} from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { TodosComponent } from './todos/todos.component';
import { AuthComponent } from './auth/auth.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HeaderComponent } from './header/header.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthInterceptorService } from './auth/auth-interceptor.service';

@NgModule({
  declarations: [
    AppComponent,
    TodosComponent,
    AuthComponent,
    HeaderComponent,
  
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    NgbModule ,
    HttpClientModule, 
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
  }
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
