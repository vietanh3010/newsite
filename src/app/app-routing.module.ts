import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminpageComponent } from './adminpage/adminpage.component';

const routes: Routes = [];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
