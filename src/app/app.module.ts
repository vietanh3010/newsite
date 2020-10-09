import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminpageComponent } from './adminpage/adminpage.component';
import { ProfilepageComponent } from './profilepage/profilepage.component';


import { Routes, RouterModule } from '@angular/router';
import { LoginpageComponent } from './loginpage/loginpage.component';

import { HttpClientModule } from '@angular/common/http';
import { AuthGuard } from './auth.guard';
import { CountorderPipe } from './pipe/countorder.pipe';
import { FormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { InvoicepageComponent } from './invoicepage/invoicepage.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SaleComponent } from './sale/sale.component';
import { MatInputModule } from '@angular/material/input';
import { ProductComponent } from './productpage/product.component';
import { UserComponent } from './userpage/user.component';

const routes: Routes = [
    { path: 'admin-page', component: AdminpageComponent, canActivate: [AuthGuard] },
    { path: 'login-page', component: LoginpageComponent },
    {
        path: 'profile-page', component: ProfilepageComponent, canActivate: [AuthGuard], children: [
            { path: 'invoicepage/:id', component: InvoicepageComponent }
        ]
    },
    { path: 'product-page', component: ProductComponent, canActivate: [AuthGuard] },
    { path: 'user-page', component: UserComponent, canActivate: [AuthGuard] },
    { path: 'invoice-page', component: InvoicepageComponent, canActivate: [AuthGuard] },
    { path: 'sale-page', component: SaleComponent, canActivate: [AuthGuard] },
    { path: '**', component: PagenotfoundComponent },
];

@NgModule({
    declarations: [
        AppComponent,
        AdminpageComponent,
        LoginpageComponent,
        ProfilepageComponent,
        CountorderPipe,
        InvoicepageComponent,
        PagenotfoundComponent,
        SaleComponent,
        ProductComponent,
        UserComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        RouterModule.forRoot(routes),
        HttpClientModule,
        FormsModule,
        Ng2SearchPipeModule,
        BrowserAnimationsModule,
        MatInputModule,
    ],
    exports: [
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
