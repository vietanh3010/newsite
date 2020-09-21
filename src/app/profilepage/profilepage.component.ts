import { Component, OnInit } from '@angular/core';
import { LoginServiceService } from '../login-service.service';
import { Router } from "@angular/router";
import { User } from '../user';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../product';

@Component({
  selector: 'app-profilepage',
  templateUrl: './profilepage.component.html',
  styleUrls: ['./profilepage.component.css']
})
export class ProfilepageComponent implements OnInit {

  infoarr: User[]= [];
  alluser: User[]= [];
  allproduct: Product[]=[];
  editField: string;

  constructor(private logoutService : LoginServiceService,
              private getalluserService : LoginServiceService,
              private getallproductService: LoginServiceService,
              private routeLogout: Router) 
          { }

  ngOnInit(): void {
    this.infoarr.push(JSON.parse(localStorage.getItem('currentUser')));

    console.log(localStorage.getItem('currentUser'));

    this.getAll();
    this.getAllproduct();
  }

  getAll():void {
    this.getalluserService.getUser()
   .subscribe(
     ( data:any[] ) => ( this.alluser = data   )
   )
  }  
  
  getAllproduct():void{
    this.getallproductService.getProduct().subscribe(
      (data:any[]) => (this.allproduct = data)
    )
  }

  public clickLogout(){
    this.logoutService.logout();
    this.routeLogout.navigate(['login-page']);
  }

  updateUser(u:User, name:string, email: string, role:string) {
    if(name!=''){u.user_name = name;}
    if(email!=''){ u.user_email = email;}
    if(role!=''){u.user_role = role;}

    this.getalluserService.updateUser(u).subscribe(
      response => {console.log(response)},
      error => {console.log(error)}
    );
  }
  updateProduct(p:Product,productName:string,productPrice:string,productImg:string){
    if(productName!='') {p.product_name=productName}
    if(productPrice!='') {p.product_price=productPrice}
    if(productImg!='') {p.prodcut_img=productImg}
    this.getallproductService.updateProduct(p).subscribe();
  }

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
