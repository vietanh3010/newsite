import { Variable } from '@angular/compiler/src/render3/r3_ast';
import { Component, OnInit } from '@angular/core';
import { LoginServiceService } from '../login-service.service';
import { User } from '../user';
 
@Component({
  selector: 'app-loginpage',
  templateUrl: './loginpage.component.html',
  styleUrls: ['./loginpage.component.css']
})
export class LoginpageComponent implements OnInit {
  testarr1: User[] =[{user_id:"222",user_name:'B',user_email:'C',user_password:'D'}];

  testarr: User[] = [];
  testarr2: User[] = [];

  constructor(private loginService : LoginServiceService) { }

  ngOnInit(): void {
    this.getAll();
    this.checkLogin('','');
  }

   getAll():void {
     this.loginService.getUser()
    .subscribe(
      ( data:any[] ) => ( this.testarr = data   )
    )
  }
  
  checkLogin(email:string , password:string): boolean  {
    
    //fetch data down to array testarr2
    this.loginService.getUser()
    .subscribe(
      ( data:any[] ) => ( this.testarr2 = data  )
    )

    //check if user input email/pass are correct and return a bool
    for(var i=0; i < this.testarr2.length; i++)
    {
      var temp: boolean = false;

      if( this.testarr2[i].user_email == email && this.testarr2[i].user_password == password)
      {
         temp = true; 
         i = this.testarr2.length - 1;
      }
      else{
         temp = false;
      }
      
    }
    
    /*while(this.testarr2[this.i].user_email != email && this.testarr2[i].user_password != password)
    {
      temp = false;
      i++;
    }*/
    
    console.log(temp);
    return temp;
  }
}
