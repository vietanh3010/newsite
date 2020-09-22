import { Component, OnInit } from '@angular/core';
import { LoginServiceService } from '../login-service.service';
import { OrderService } from '../service/order.service';
import { Router } from "@angular/router";
import { User } from '../model/user';
import { Neworder } from '../model/neworder';
import { Product } from '../model/product';
import { Order } from '../model/order';
import {LOCAL_STORAGE, WebStorageService} from 'angular-webstorage-service';
import { BehaviorSubject, Observable } from 'rxjs';
import { NeworderService } from '../service/neworder.service';
import { stringify } from 'querystring';


@Component({
  selector: 'app-customerpage',
  templateUrl: './customerpage.component.html',
  styleUrls: ['./customerpage.component.css']
})
export class CustomerpageComponent implements OnInit {
  
  mycart:Neworder[]=[];
  myhistory:Neworder[]=[];
  myinfo:User[]=[];

  temp:Neworder[]=[];
  temp1:Neworder[]=[];
  temp2:number[] = [];
  mytotal:Product[]=[];

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private getmyorderService: NeworderService,
              private getmyinfoService: LoginServiceService,
              private myroute: Router,
    ) { 
      this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
              this.currentUser = this.currentUserSubject.asObservable();
    }

  ngOnInit():void  {
    this.getMycart();
    this.getMyinfo();
    this.getMyhistory();
    this.gettotal();
    console.log(this.temp1);
  }

  async gettotal(){
    this.temp1 = [];
   this.temp1 = await this.getmyorderService.getNeworder().toPromise();
   this.temp1 = this.temp1.filter( 
          t =>
        (t.total_paid === 0) &&
        ((t.customer as User).user_id === this.currentUserSubject.value.user_id)
    )
   
   var c = 0;
   for(var i = 0; i < this.temp1.length ; i++)
   {
     c += this.temp1[i].total_unpaid;
   }
   console.log(c)
   this.temp2.push(c);
  }

  //unpaid items
  getMycart():void {
    this.getmyorderService.getNeworder().subscribe(
      (data:any[]) => (this.mycart = data.filter
        ( t => 
          (t.total_paid === 0)
         && (t.customer.user_id === this.currentUserSubject.value.user_id)
        )

      )
    )
  }
  //paid items
  getMyhistory():void {
    this.getmyorderService.getNeworder().subscribe(
      (data:any[]) => (this.myhistory = data.filter
        ( t => (t.total_unpaid === 0) 
        && (t.customer.user_id === this.currentUserSubject.value.user_id) 
        )
        )
    )
  }
  //get data of current user
  getMyinfo():void {
    this.myinfo.push(this.currentUserSubject.value);
  }

  //pay for a single order and move from cart to history
  paySingleorder(o:Neworder)
  {
      o.total_paid = o.total_price;
      o.total_unpaid = 0;
      this.getmyorderService.updateNeworder(o).subscribe(); 
  }

   payAllorder() {
    for(var i = 0; i < this.temp1.length ; i++)
    {
      this.temp1[i].total_paid = this.temp1[i].total_price;
      this.temp1[i].total_unpaid = 0;
      console.log(this.temp1[i])
      this.getmyorderService.updateNeworder(this.temp1[i]).subscribe( ); 
    }
  }
}
