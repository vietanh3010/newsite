import { Component, OnInit } from '@angular/core';
import { LoginServiceService } from '../login-service.service';
import { Router } from "@angular/router";
import { User } from '../user';

@Component({
  selector: 'app-profilepage',
  templateUrl: './profilepage.component.html',
  styleUrls: ['./profilepage.component.css']
})
export class ProfilepageComponent implements OnInit {

  infoarr: User[]= [];
  alluser: User[]= [];
  editField: string;

  constructor(private logoutService : LoginServiceService,
              private getalluserService : LoginServiceService,
              private routeLogout: Router) 
          { }

  ngOnInit(): void {
    this.infoarr.push(JSON.parse(localStorage.getItem('currentUser')));

    console.log(localStorage.getItem('currentUser'));

    this.getAll();
  }

  getAll():void {
    this.getalluserService.getUser()
   .subscribe(
     ( data:any[] ) => ( this.alluser = data   )
   )
  }  

  public clickLogout(){
    this.logoutService.logout();
    this.routeLogout.navigate(['login-page']);
  }

  changeValue(id: number, property: string, event: any)
  {
    this.editField = event.target.textContent;
  }

  updateUser() {
   
  }

  remove(user: User) {
    let index = this.alluser.indexOf(user)
    this.alluser.splice(index, 1);
    this.getalluserService.deleteUser(user.user_id).subscribe();
  }


}
