import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminpageComponent } from './adminpage/adminpage.component';
import { TestingpageComponent } from './testingpage/testingpage.component';
import { ProfilepageComponent } from './profilepage/profilepage.component';


import { Routes, RouterModule } from '@angular/router';
import { AppheaderComponent } from './appheader/appheader.component';
import { LoginpageComponent } from './loginpage/loginpage.component';

import { HttpClientModule } from '@angular/common/http';
import { AuthGuard } from './auth.guard';
import { ProductpageComponent } from './productpage/productpage.component';
import { CountorderPipe } from './pipe/countorder.pipe';
import { CustomerpageComponent } from './customerpage/customerpage.component';



const routes: Routes =[
  {path: 'admin-page', component: AdminpageComponent , canActivate: [AuthGuard]},
  {path: 'login-page', component: LoginpageComponent},
  {path: 'testing-page', component: TestingpageComponent},
  {path: 'profile-page', component: ProfilepageComponent, canActivate: [AuthGuard]},
  {path: 'product-page', component:ProductpageComponent},
  {path: 'customer-page', component:CustomerpageComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    AdminpageComponent,
    TestingpageComponent,
    AppheaderComponent,
    LoginpageComponent,
    ProfilepageComponent,
    ProductpageComponent,
    CountorderPipe,
    CustomerpageComponent,
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
