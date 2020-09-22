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

@Component({
  selector: 'app-profilepage',
  templateUrl: './profilepage.component.html',
  styleUrls: ['./profilepage.component.css']
})
export class ProfilepageComponent implements OnInit {

  infoarr: User[]= [];
  alluser: User[]= [];
  allproduct: Product[]=[];
  allneworder:Neworder[]=[];
  myorder:Order[]=[];
  editField: string;

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private logoutService : LoginServiceService,
              private getalluserService : LoginServiceService,
              private getallproductService: LoginServiceService,
              private getallneworderService: NeworderService,
              private routeLogout: Router) 
          {
              this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
              this.currentUser = this.currentUserSubject.asObservable();
           }

  ngOnInit(): void {
    this.infoarr.push(JSON.parse(localStorage.getItem('currentUser')));

    console.log(localStorage.getItem('currentUser'));

    this.getAll();
    this.getAllproduct();
    this.getAllneworder();
    console.log(this.currentUserSubject.value);
  }
  //get list users
  getAll():void {
    this.getalluserService.getUser()
   .subscribe(
     ( data:any[] ) => ( this.alluser = data   )
   )
  }  
  //get list products
  getAllproduct():void{
    this.getallproductService.getProduct().subscribe(
      (data:any[]) => (this.allproduct = data)
    )
  }
  //get list orders
  async getAllneworder() {
    this.allneworder = await this.getallneworderService.getNeworder().toPromise();
  }
  //get all orders of the current user


  public clickLogout(){
    this.logoutService.logout();
    this.routeLogout.navigate(['login-page']);
  }
  //update
  updateUser(u:User, name:string, email: string, role:string) {
    if(name!=''){u.user_name = name;}
    if(email!=''){ u.user_email = email;}
    if(role!=''){u.user_role = role;}

    this.getalluserService.updateUser(u).subscribe(
      response => {console.log(response)},
      error => {console.log(error)}
    );
  }
  updateProduct(p:Product,productName:string,productPrice:number,productImg:string){
    p.product_name=productName;
    p.product_price=productPrice;
    p.product_img=productImg;
    this.getallproductService.updateProduct(p).subscribe();
  }
  updateNeworder(o:Neworder,price:number,paid:number,unpaid:number) {
    o.total_price = price;
    o.total_paid = paid;
    o.total_unpaid = unpaid;
    o.updated_at = Date();
    this.getallneworderService.updateNeworder(o).subscribe();
  }

  //delete
  removeUser(user: User) {
    let index = this.alluser.indexOf(user);
    this.alluser.splice(index, 1);
    this.getalluserService.deleteUser(user.user_id).subscribe();
  }
  removeProduct(product:Product){
    let index = this.allproduct.indexOf(product);
    this.allproduct.splice(index,1);
    this.getallproductService.deleteProduct(product.product_id).subscribe();
  }
  removeNeworder(order:Neworder) {
    let index = this.allneworder.indexOf(order);
    this.allneworder.splice(index,1);
    this.getallneworderService.deleteNeworder(order.order_id).subscribe();
  }
  //add
  addnewUser( user_name:string, user_email:string, user_password:string, user_role:string){
    var user_id :string= "myuid";
    var is_login: boolean = false;
    const unknUser: unknown = { user_id,user_name,user_email,user_password,is_login,user_role};
    const newUser: User = unknUser as User;
    this.getalluserService.addUser(newUser).subscribe();
  }
  addnewProduct(product_name:string,product_price:string,product_img:string){
    var product_id:string ="mypID";
    const unknProduct: unknown = {product_id, product_name, product_price, product_img};
    const newProduct: Product = unknProduct as Product;
    this.getallproductService.addProduct(newProduct).subscribe();
  }


}
