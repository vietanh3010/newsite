import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { LoginServiceService } from '../login-service.service';
import { OrderService } from '../service/order.service';
import { User } from '../model/user';
import { Neworder } from '../model/neworder';
import { Product } from '../model/product';
import {LOCAL_STORAGE, WebStorageService} from 'angular-webstorage-service';
import { BehaviorSubject, Observable } from 'rxjs';
import { NeworderService } from '../service/neworder.service';
import { Output, Input, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { Cart } from '../model/cart';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { promise } from 'protractor';


@Component({
  selector: 'app-invoicepage',
  templateUrl: './invoicepage.component.html',
  styleUrls: ['./invoicepage.component.css']
})
export class InvoicepageComponent implements OnInit {

  infoarr: User[]= [];
  param: any ='';

  orderlist : Neworder[] = [];
  productlist: Product[] = [];

  singleCustomer: User[]=[];
  singleOrder: Neworder[] = [];
  tempProductbyid: Product[]=[];
  current_cart : Cart[]=[];
  currentDate:string[] = [];
  ha;
  product_cart: Product[] = []; //paralel to current_cart {product_name}

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  constructor(
              private activateRoute:ActivatedRoute,
              private getalluserService: LoginServiceService,
              private getallneworderService: NeworderService, 
              private invoice_route: Router,
              ) 
              { 
              this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
              this.currentUser = this.currentUserSubject.asObservable();
              
              }

  
   ngOnInit() {
    this.infoarr.push(JSON.parse(localStorage.getItem('currentUser')));//admin info from localstorage
     //get customer info
    //get order info
    this.currentDate.push(Date());
    console.log(this.currentDate[0]);

    this.activateRoute.url.subscribe();
    this.param=this.activateRoute.snapshot.params.orderid;

    this.getallorder();
    this.getallproduct();
     //param is the order id
    this.get_order_and_buyer();
    console.log("param is " +this.param);
    this.printpdf();
  }

  async getallorder() {
    this.orderlist = await this.getallneworderService.getNeworder().toPromise()
    this.ha = (this.orderlist.filter(any => any.order_hash == this.param) as Neworder[])[0].order_id;
  }

  getallproduct():void {
    this.getalluserService.getProduct().subscribe(
      (data:any[]) => (this.productlist = data)
    )
  }

  async get_order_and_buyer(){

    this.orderlist = await this.getallneworderService.getNeworder().toPromise()
    this.ha = (this.orderlist.filter(any => any.order_hash == this.param) as Neworder[])[0].order_id;


    if (this.param == undefined)
    {
      this.invoice_route.navigate(['pagenotfound']);
    }
    else
    {
      for(var i = 0; i < this.orderlist.length; i++)
      {
        if(this.orderlist[i].order_id == this.ha )
        {
          this.singleOrder.push(this.orderlist[i]);
        }
      }
      this.singleCustomer.push({
        user_id: (this.singleOrder[0].customer as User).user_id,
        user_name: (this.singleOrder[0].customer as User).user_name,
        user_email: (this.singleOrder[0].customer as User).user_email,
        user_password: (this.singleOrder[0].customer as User).user_password,
        is_login: (this.singleOrder[0].customer as User).is_login,
        user_role: (this.singleOrder[0].customer as User).user_role
      })
    }

    for(var i = 0; i < (this.singleOrder[0].products).length ; i++)
    {
      this.current_cart.push({
        product_id: (this.singleOrder[0].products[i] as Cart).product_id,
        product_quantity: (this.singleOrder[0].products[i] as Cart).product_quantity
      })
    }
    
    for(var i = 0; i < this.current_cart.length; i++){
      for(var j = 0 ; j < this.productlist.length; j++)
      {
        if(this.current_cart[i].product_id == this.productlist[j].product_id)
        {
          this.product_cart.push({
            product_id: this.productlist[j].product_id,
            product_name: this.productlist[j].product_name,
            product_price: this.productlist[j].product_price,
            product_img: this.productlist[j].product_img,
            product_stock: this.productlist[i].product_stock,
            product_bought: this.productlist[i].product_bought,
            product_created_at: this.productlist[i].product_created_at,
            product_updated_at: this.productlist[i].product_updated_at,
          });
          j = this.productlist.length;
        }
        
      }
    }

    console.log(this.product_cart);
    console.log(this.current_cart);
    console.log(this.singleOrder);
    console.log(this.singleCustomer);
  } 

   get_product_by_id(id:any){
    for(var i=0 ; i<this.productlist.length ; i++)
    {
      if(this.productlist[i].product_id == id)
      {
        this.tempProductbyid.push( {
            product_id: this.productlist[i].product_id,
            product_name: this.productlist[i].product_name,
            product_price: this.productlist[i].product_price,
            product_img: this.productlist[i].product_img,
            product_stock: this.productlist[i].product_stock,
            product_bought: this.productlist[i].product_bought,
            product_created_at: this.productlist[i].product_created_at,
            product_updated_at: this.productlist[i].product_updated_at,
        }) ;
      }
    }
  }


  public printpdf(){
    setTimeout(() => {
      window.print();
     }, 3000);
  }
  public printpdf1(){
      window.print();
  }
 
}
