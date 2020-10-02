import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
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
import { userInfo } from 'os';
import { stringify } from 'querystring';

@Component({
  selector: 'app-profilepage',
  templateUrl: './profilepage.component.html',
  styleUrls: ['./profilepage.component.css']
})

export class ProfilepageComponent implements OnInit {

  sortType: string;
  sortReverse: boolean = false;

  infoarr: User[]= [];

  alluser: User[]= [];
  allproduct: Product[]=[];
  
  allneworder:Neworder[]=[];
  searchUser;
  searchProduct;
  searchOrder;
  test: any[];

  userSort: boolean=undefined;
  productSort: boolean=undefined;
  orderSort: boolean=undefined;

  neworder: any[] =  [{
    id:0,
    product_id: '',
    product_quantity: '',
  }];

  chooseUser:string='';
  chooseProduct:string='';
  chooseOrder:string='';

  selectedProduct;

  toggle=true;
  status='Enable';
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private logoutService : LoginServiceService,
              private getalluserService : LoginServiceService,
              private getallproductService: LoginServiceService,
              private getallneworderService: NeworderService,
              private routeLogout: Router,
              ) 
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

  enableBordercolor() {
    this.toggle = !this.toggle;
    this.status = this.toggle ? 'Enable' : 'Disable';
  }
  sortUser(property:any){
    this.chooseUser = property;
    if(this.chooseUser == 'user_id')
    {
      if(this.userSort)
      {
      this.alluser.sort( (a,b) => parseFloat(a[property]) < parseFloat(b[property])? -1: 1);
      this.userSort = false;
      }
      else 
      {
      this.alluser.sort( (a,b) => parseFloat(a[property]) > parseFloat(b[property])? -1: 1);
      this.userSort = true;
      }
    }
    else{
      if(this.userSort)
      {
      this.alluser.sort( (a,b) => String(a[property]) < String(b[property])? -1: 1);
      this.userSort = false; 
      }
      else 
      {
      this.alluser.sort( (a,b) => String(a[property]) > String(b[property])? -1: 1);
      this.userSort = true;
      }
    }
  }

  sortProduct(property:any){
    this.chooseProduct = property;
    if(this.chooseProduct == 'product_id' || this.chooseProduct == 'product_price' || this.chooseProduct == 'product_stock' || this.chooseProduct == 'product_bought')
    {
      if(this.productSort)
      {
      this.allproduct.sort( (a,b) => parseFloat(a[property]) < parseFloat(b[property])? -1: 1);
      this.productSort = false;
      }
      else 
      {
      this.allproduct.sort( (a,b) => parseFloat(a[property]) > parseFloat(b[property])? -1: 1);
      this.productSort = true;
      }
    }
    else{
      if(this.productSort)
      {
      this.allproduct.sort( (a,b) => a[property].toLowerCase() < b[property].toLowerCase()? -1: 1);
      this.productSort = false;
      }
      else 
      {
      this.allproduct.sort( (a,b) => a[property].toLowerCase() > b[property].toLowerCase()? -1: 1);
      this.productSort = true;
      }
    }
  }

  sortOrder(property:any){
    this.chooseOrder = property;
    if(this.chooseOrder == 'total_price' || this.chooseOrder == 'total_paid' || this.chooseOrder == 'total_unpaid')
    {
      if(this.orderSort)
      {
      this.allneworder.sort( (a,b) => parseFloat(a[property]) < parseFloat(b[property])? -1: 1);
      this.orderSort = false;
      }
      else 
      {
      this.allneworder.sort( (a,b) => parseFloat(a[property]) > parseFloat(b[property])? -1: 1);
      this.orderSort = true;
      }
    }
    else{
      if(this.orderSort)
      {
      this.allneworder.sort( (a,b) => a[property].toLowerCase() < b[property].toLowerCase()? -1: 1);
      this.orderSort = false;
      }
      else 
      {
      this.allneworder.sort( (a,b) => a[property].toLowerCase() > b[property].toLowerCase()? -1: 1);
      this.orderSort = true;
      }
    }
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
  getAllneworder(){
    this.getallneworderService.getNeworder().subscribe(
      (data:any[]) => (this.allneworder = data)
    )
  }
  //async getAllneworder() {
  //  this.allneworder = await this.getallneworderService.getNeworder().toPromise();
  //}
  //get all orders of the current user


  public clickLogout(){
    this.logoutService.logout();
    this.routeLogout.navigate(['login-page']);
  }
  //update
  updateUser(u:User, name:string, email: string,password:string, role:string) {
    if(name!=''){u.user_name = name;}
    if(email!=''){ u.user_email = email;}
    if(password!=''){u.user_password = password;}
    if(role!=''){u.user_role = role;}

    this.getalluserService.updateUser(u).subscribe(
      response => {console.log(response)},
      error => {console.log(error)}
    );
  }
  updateProduct(p:Product,productName:string,productPrice:number,productImg:string){
    if(productName != '') {p.product_name=productName;}
    if(productPrice.toString() != '') {p.product_price=productPrice;}
    if(productImg != '') {p.product_img=productImg;}
    this.getallproductService.updateProduct(p).subscribe();
  }

  updateNeworder(o:Neworder, price : number, paid : number, unpaid : number) {
    if( price.toString() != '') { o.total_price = price; }
    if( paid.toString() != '') { o.total_paid = paid; }
    if( unpaid.toString() != '') { o.total_unpaid = unpaid; }
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
  addnewProduct(product_name:string,product_price:number,product_img:string){
    var product_id:string ="mypID";
    var product_stock:number = 0;
    var product_bought:number =0;
    var product_created_at: string = Date();
    var product_updated_at: string = Date();
    const unknProduct: unknown = {product_id, product_name, product_price, product_img,product_stock,product_bought,product_created_at,product_updated_at};
    const newProduct: Product = unknProduct as Product;
    this.getallproductService.addProduct(newProduct).subscribe();
  }
  addnewOrder(total_price:number,customer:Object,products:Cart[])
  {
    var order_id:string = "myoID";
    var total_paid:number = 0;
    var total_unpaid:number = total_price;
    var created_at: string = Date();
    var updated_at: string = Date();
    const unknOrder: unknown = {order_id,total_price,total_paid,total_unpaid,customer,products,created_at,updated_at};
    const newOrder: Neworder = unknOrder as Neworder;
    this.getallneworderService.addNeworder(newOrder).subscribe();
  }
  
  addinput(){
      this.neworder.push({
        id:this.neworder.length+1,
        product_id: '',
        product_quantity: '',
      });
      console.log(this.neworder)
  }
  
  removethis(q:number){
    this.neworder.splice(q,1);
  }
  modaldismiss(){
    this.neworder = [{
      id:0,
      product_id: '',
      product_quantity: '',
    }];
  }
  setOrder(userid: any){
    console.log(this.neworder);
    console.log(userid);

    var totalprice = this.getTotalprice(this.neworder);
    var customerObj: User = this.getUserbyid(userid);
    var cartArr  = this.getArrproduct(this.neworder);

    this.addnewOrder(totalprice,customerObj,cartArr);
    this.modaldismiss();
  }
  getArrproduct(neworderarr:any[]):Cart[]{
    var tempCartarr: Cart[] = [];

    for(var i = 0; i< neworderarr.length ; i++)
    {
      tempCartarr.push( 
        {
          product_id: neworderarr[i].product_id,
          product_quantity: neworderarr[i].product_quantity
        }
       );
    }
    return tempCartarr;
  }

  //get totalprice from input array
  getTotalprice(p:any[]):number{
    var total:number=0;
    var tempObj: Product;

    for(var i=0 ; i<p.length ; i++)
    {
      tempObj = this.getProductbyid( p[i].product_id )

      total += ( (tempObj.product_price) * (+p[i].product_quantity) )
    }
    return total;
  }

  //get user by id, return object user
  getUserbyid(id:any):User{
    var tempUser: User;
    for(var i=0 ; i<this.alluser.length ; i++){
      if(this.alluser[i].user_id===id)
      {
        tempUser = {
          user_id : this.alluser[i].user_id,
          user_name : this.alluser[i].user_name,
          user_email : this.alluser[i].user_email,
          user_password : this.alluser[i].user_password,
          is_login : this.alluser[i].is_login,
          user_role : this.alluser[i].user_role,
        }
      }
    }
    return tempUser;
  }
  //get product by id, return object product
  getProductbyid(id:any):Product{
    var tempProduct: Product;

    for(var i=0 ; i<this.allproduct.length ; i++)
    {
      if(this.allproduct[i].product_id===id)
      {
        tempProduct ={
          product_id : this.allproduct[i].product_id,
          product_name : this.allproduct[i].product_name,
          product_price : this.allproduct[i].product_price,
          product_img : this.allproduct[i].product_img,
          product_stock: this.allproduct[i].product_stock,
          product_bought: this.allproduct[i].product_bought,
          product_created_at: this.allproduct[i].product_created_at,
          product_updated_at: this.allproduct[i].product_updated_at,
        }
      }
    }
    return tempProduct;
  }



}
