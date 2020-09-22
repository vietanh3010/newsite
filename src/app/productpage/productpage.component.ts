import { Component, OnInit } from '@angular/core';
import { Product } from '../model/product';
import { User } from '../model/user';
import { LoginServiceService } from '../login-service.service';
import {LOCAL_STORAGE, WebStorageService} from 'angular-webstorage-service';
import { Injectable, Inject } from "@angular/core";
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from "@angular/router";
import { Order } from '../model/order';
import { OrderService } from '../service/order.service';
import { ThrowStmt } from '@angular/compiler';
import { Neworder } from '../model/neworder';
import { NeworderService } from '../service/neworder.service';

@Component({
  selector: 'app-productpage',
  templateUrl: './productpage.component.html',
  styleUrls: ['./productpage.component.css']
})
export class ProductpageComponent implements OnInit {
  listProduct: Product[] = [];
  listOrder:Order[] = [];
  listNeworder: Neworder[]=[];

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private productService:LoginServiceService,
              private orderService: OrderService,
              private neworderService: NeworderService,
              private productRouter: Router,
              ) 
  {
              this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
              this.currentUser = this.currentUserSubject.asObservable();
   }

  ngOnInit(): void {
    this.getProduct();
    this.getOrder();
  }

  getProduct(){
    this.productService.getProduct().subscribe(
      (data:any)  =>  (this.listProduct=data)  );
  }
  getOrder():Order[] {
    this.orderService.getOrder().subscribe(
      (data:any)  =>  (this.listOrder=data)  );
      return this.listOrder;
  }

  getNeworder():Neworder[] {
      this.neworderService.getNeworder().subscribe(
        (data:any) => (this.listNeworder = data));
        return this.listNeworder;;
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }
  toCart(){
    this.productRouter.navigate(['customer-page']);
  }
  
  //click buy -> check login and add to cart
  updateNeworder(product:Product){
    console.log(localStorage);
    console.log(this.currentUserValue);
    if(this.currentUserValue===null) //click buy-> not login -> redirect to login page
    {
      this.productRouter.navigate(['login-page']);
    }
    else{
      console.log(this.currentUserValue.user_id);
      var order_id: string = "myNeworderid";
      var total_price:number = parseFloat(product.product_price);
      var total_paid: number = 0;
      var total_unpaid: number = total_price;
      var customer: Object = this.currentUserSubject.value;
      var products: Object = product;
      var created_at: Date = new Date();
      var updated_at: Date = new Date();


      const unknOrder: unknown = {order_id,total_price,total_paid,total_unpaid, customer, products, created_at,updated_at }
      const newOrder: Neworder = unknOrder as Neworder;
      console.log(newOrder);
      this.neworderService.addNeworder(newOrder).subscribe();
    }
  }
  

  

}
