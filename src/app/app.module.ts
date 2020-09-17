import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminpageComponent } from './adminpage/adminpage.component';
import { TestingpageComponent } from './testingpage/testingpage.component';
import { Routes, RouterModule } from '@angular/router';
import { AppheaderComponent } from './appheader/appheader.component';
import { LoginpageComponent } from './loginpage/loginpage.component';

import { HttpClientModule } from '@angular/common/http';


const routes: Routes =[
  {path: 'admin-page', component: AdminpageComponent},
  {path: 'login-page', component: LoginpageComponent},
 
  {path: 'testing-page', component: TestingpageComponent},
     
  
];
@NgModule({
  declarations: [
    AppComponent,
    AdminpageComponent,
    TestingpageComponent,
    AppheaderComponent,
    LoginpageComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
  ],
  exports : [
    AppheaderComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
