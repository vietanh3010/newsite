import { AfterViewInit, Component, OnInit, ViewChild, ɵConsole } from '@angular/core';
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
import { removeData, type } from 'jquery';
import { stringify } from 'querystring';
import { ThrowStmt } from '@angular/compiler';
import { ProductpageComponent } from '../productpage/productpage.component';
import { Hash } from 'crypto';
import {Md5} from 'ts-md5/dist/md5';
import { color } from 'html2canvas/dist/types/css/types/color';

export interface TabID {
  tab_id: number,
  tab_product: Cart[],
  tab_price: number,
  tab_total: number,
  
}
export interface TabTotal {
  id: number,
  total:number,
}
export interface MyToast{
  type: string;
  message: string;
}
@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.css']
})
export class SaleComponent implements OnInit {
  math= Math;
  infoarr: User[]= [];
  
  alluser: User[]= [];
  allproduct: Product[]=[];
  allneworder: Neworder[]=[];
  tempneworder: Neworder[]=[];
  productlist: Product[]=[];
  pname_arr :Product[]= [];//arr of product name
  pid_arr: Product[] = [];// arr of product id
  pset_arr: Product[]= [];// arr after unique concat pname pid
  err: MyToast[] = [];
  
  product_most_stock: Product[] = [];
  product_most_bought: Product[] = [];
  t;
  u;
  discount;
  sub;
  to;
  qty;
  searchProduct;
  searchList;
  searchTerm;
  chosen_property:string='';
  product_sort:boolean = undefined;

  temporder: any[] = [1];
  tab_arr: TabID[] =[];
  tabtotal: TabTotal[] = [];
  checkq:string[] = [];
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  constructor(
                private getalluserService : LoginServiceService,
                private getallproductService: LoginServiceService,
                private getallneworderService: NeworderService,
                private myrouter: Router
              )
               {
                this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
                this.currentUser = this.currentUserSubject.asObservable();
                }

  ngOnInit(): void {
    this.infoarr.push(JSON.parse(localStorage.getItem('currentUser')));
    this.getallneworderService.getNeworder().subscribe(
      (data:any[]) => (this.allneworder = data)
    )
    this.getAll();
    this.getAllproduct();
  }

  blur_discount()
  {
    if(this.discount==undefined || this.discount == '')
    {
      this.discount=0;
    }
    
    this.sub = Number(this.to)  - Number(this.discount);
    if(this.sub <= 0)
    {
      this.sub =0;
    }
    
  }
  add_and_minus(property:string,item: TabID,pro: Cart){

    var p_qty = ((this.tab_arr.filter(any => any.tab_id==item.tab_id).filter(any => any.tab_product.length==1)
    .filter(any => any.tab_product[0].product_id == pro.product_id) as TabID[])[0].tab_product as Cart[])[0].product_quantity;
    if(property == 'add')
    {
      ((this.tab_arr.filter(any => any.tab_id==item.tab_id).filter(any => any.tab_product.length==1)
      .filter(any => any.tab_product[0].product_id == pro.product_id) as TabID[])[0].tab_product as Cart[])[0].product_quantity +=1;
  
      var p_id = ((this.tab_arr.filter(any => any.tab_id==item.tab_id).filter(any => any.tab_product.length==1)
      .filter(any => any.tab_product[0].product_id == pro.product_id) as TabID[])[0].tab_product as Cart[])[0].product_id;
  
      var p_total = (this.allproduct.filter(any => any.product_id == pro.product_id)as Product[])[0].product_price ;
  
      (this.tabtotal.filter(any=>any.id == item.tab_id) as TabTotal[]).sort( (a,b) => a.total > b.total ? -1 :1)[0].total += Number(p_total);
  
      this.to = Number(this.to) + Number(p_total);
      if(this.discount==undefined || this.discount == '')
      {
        this.discount=0;
      }
      this.sub = Number(this.to)  - Number(this.discount);
      if(this.sub <= 0)
      {
        this.sub =0;
      }
    }
    else if(p_qty >1 && property == 'minus')
    {
      ((this.tab_arr.filter(any => any.tab_id==item.tab_id).filter(any => any.tab_product.length==1)
      .filter(any => any.tab_product[0].product_id == pro.product_id) as TabID[])[0].tab_product as Cart[])[0].product_quantity -=1;
  
      var p_id = ((this.tab_arr.filter(any => any.tab_id==item.tab_id).filter(any => any.tab_product.length==1)
      .filter(any => any.tab_product[0].product_id == pro.product_id) as TabID[])[0].tab_product as Cart[])[0].product_id;
  
      var p_total = (this.allproduct.filter(any => any.product_id == pro.product_id)as Product[])[0].product_price ;
  
      (this.tabtotal.filter(any=>any.id == item.tab_id) as TabTotal[]).sort( (a,b) => a.total > b.total ? -1 :1)[0].total -= Number(p_total);
  
      this.to = Number(this.to) - Number(p_total);
      if(this.discount==undefined || this.discount == '')
      {
        this.discount=0;
      }
      this.sub = Number(this.to)  - Number(this.discount);
      if(this.sub <= 0)
      {
        this.sub =0;
      }
    }
    else{ //when quantity at 1
      this.remove_tabproduct(item,pro);
    }
  }
  remove_tabproduct(item:TabID,pro:Cart){   //remove tab by tabid and product id

    for(var i=0; i<this.tab_arr.length;i++)
    {
      if(this.tab_arr[i].tab_id == item.tab_id )
      {
        if(this.tab_arr[i].tab_product.length == 0 )
        {
          this.tab_arr.splice( i,1) ;
          i-=1;
        }
        else if( this.tab_arr[i].tab_product[0].product_id == pro.product_id)
        {
          this.to = Number(this.to) - ( this.tab_arr[i].tab_product[0].product_quantity * (this.allproduct.filter(any => any.product_id == pro.product_id)as Product[])[0].product_price) ;
          if(this.discount==undefined)
          {
            this.discount=0;
          }
          this.sub = Number(this.to)  - Number(this.discount);
          if(this.sub <= 0)
          {
            this.sub =0;
          }
          this.tab_arr.splice( i,1) ;
          i-=1;
        }
      }
    }
    this.make_error('info',"Removed item id#"+String(pro.product_id)+" from tab "+item.tab_id.toString())
  }
  find_product(p:any){
    this.chooseProduct(p);
    this.searchTerm = "#"+String(p.product_id) +": " + p.product_name  ;
    this.pset_arr = [];
  }
  input_onblur(){
    this.pset_arr = [];
  }
  input_close(){
    this.searchTerm = '';
    this.input_focus();
  }
  input_focus(){
    this.search();
  }
  search(): void {
    if(this.searchTerm != '')
    {
    let term = this.searchTerm.toLowerCase();
    this.pname_arr = [];
    this.pid_arr = [];
    this.pname_arr = this.allproduct.filter(function(s){return s.product_name.includes(term);});
    this.pid_arr = this.allproduct.filter(function(s){return s.product_id.includes(term);});

    this.pset_arr = [];
    var newset = new Set(this.pname_arr.concat(this.pid_arr));
    var myset = Array.from(newset)
    
    this.pset_arr = myset as Product[]; 
    this.pset_arr.sort();
    console.log(this.pset_arr);
    }
    else{
      this.pset_arr = [];
      
    }
  }
  
  total(s:any){
    console.log(s+"and"+this.to);
  }
  change(u:any){
    this.make_error('success',"User "+u.user_name+" chosen!");
    console.log(this.u.user_id +"and" + u.user_name);
  }
  getAll():void {
    this.getalluserService.getUser()
   .subscribe(
     ( data:any[] ) => ( this.alluser = data )
   )
  }  
  //get list products
  getAllproduct():void{
    this.getallproductService.getProduct().subscribe(
      (data:any[]) => (
        this.allproduct = data,
        this.productlist = data
        )
    )
  }
  sort_by_product(property:string){
    this.chosen_property = property;

    if( this.chosen_property == 'product_stock' || this.chosen_property == 'product_bought' || this.chosen_property == 'product_id' || this.chosen_property == 'product_updated_at') //parse and sort number
    {
      if(this.product_sort)
      {
      this.allproduct.sort( (a,b) => parseFloat(a[property]) < parseFloat(b[property]) ? -1: 1);
      this.product_sort = false;
      }
      else 
      {
      this.allproduct.sort( (a,b) => parseFloat(a[property]) > parseFloat(b[property]) ? -1: 1);
      this.product_sort = true;
      }
    }
    else{
      if(this.product_sort)
      {
      this.allproduct.sort( (a,b) => String(a[property]).toLowerCase() < String(b[property]).toLowerCase() ? -1: 1);
      this.product_sort = false; 
      }
      else 
      {
      this.allproduct.sort( (a,b) => String(a[property]).toLowerCase() > String(b[property]).toLowerCase() ? -1: 1);
      this.product_sort = true;
      }
    }
  }
  test(a:any){ //refresh tab
    this.sub=0;
    this.t=a;
    this.tabcolor(a);
    if(this.to==undefined)
    {
      this.to=0;
    }
    if(this.discount==undefined || this.discount == '')
      {
        this.discount=0;
      }

    // if((this.tabtotal.filter(any=>any.id == this.t) as TabTotal[]).length == 0)
    // {
    //   this.to = 0
    // }
    // else{
    //   this.to = (this.tabtotal.filter(any=>any.id == this.t) as TabTotal[])[0].total;
    // }
    this.to =0;
    this.tab_arr.forEach(any => { 
      if(any.tab_id == this.t && any.tab_product.length == 1)
      {
        this.to = Number(this.to) +  any.tab_product[0].product_quantity * (this.allproduct.filter(a=>a.product_id==any.tab_product[0].product_id) as Product[])[0].product_price
      }
      
    });

    this.sub = Number(this.to)  - Number(this.discount);
    if(this.sub <= 0)
    {
      this.sub =0;
    }
  }
  addTab(){
    var tempc:number = 1;
    while( this.temporder.includes(tempc))
    {
      tempc++;
    }
    this.temporder.push(tempc);
    
  }
  removeTab(x:number){
    if(this.t==x)
    {
      this.t=this.temporder[x-1];
    }
    this.temporder.splice(x,1);
    console.log("order in array"+x);
    console.log(this.temporder)
    
  }
  removeAll(tab:number){
      for(var i=this.tab_arr.length-1; i>=0;i--)
      {
        if( tab == this.tab_arr[i].tab_id)
        {
          this.tab_arr.splice( this.tab_arr.indexOf(this.tab_arr[i]),1)
        }
      }

      for(var i = 0; i< this.tabtotal.length;i++)
      {
        if(this.tabtotal[i].id==tab)
        {
          this.tabtotal.splice( this.tabtotal.indexOf(this.tabtotal[i]) ,1);
        }
      }
      console.log("tab"+tab);
  }
  chooseProduct(p:Product)
  {
    var tabid = this.t;
    var productid = p.product_id;
    var productqty=1;
    var sum = 0;
    if(this.t == undefined)
    {
      this.make_error('warning',"Please choose a tab first!!!");
    }
    else if(this.t != undefined)
    {
      for(var i=0;i<this.tab_arr.length;i++)
      {
        if(tabid == this.tab_arr[i].tab_id)
        {
          for(var j=0;j < this.tab_arr[i].tab_product.length; j++)
          {
            if(productid == this.tab_arr[i].tab_product[j].product_id)
            {
              productqty += this.tab_arr[i].tab_product[j].product_quantity;
              this.tab_arr[i].tab_product.splice( this.tab_arr[i].tab_product.indexOf(this.tab_arr[i].tab_product[j],1) )
            }
          }
        }
      }
      if( this.tab_arr.filter(item => item.tab_id === this.t).length == 0)
      {
        sum = p.product_price;
      }
      else{
        sum = this.tab_arr.filter(item => item.tab_id === this.t).reduce((sum,current) =>  sum = p.product_price+current.tab_total,0) ; //only if tabid exists
      }

      this.tab_arr.push({
        tab_id: tabid,
        tab_product: [{
          product_id: productid,
          product_quantity: productqty,
        }],
        tab_price: (productqty*p.product_price),
        tab_total: sum,
      })
      this.tabtotal.push({
        id: tabid,
        total: p.product_price
       })
      for(var i = 0; i< this.tabtotal.length;i++)
      {
        if(this.tabtotal[i].id==this.t)
        {
          this.tabtotal.splice( this.tabtotal.indexOf(this.tabtotal[i]) ,2);
        }
      }

      this.tabtotal.push({
        id: tabid,
        total: sum
      })
     

      // if(this.tabtotal.length == 0)
      // {
      //   this.tabtotal.push({
      //     id: tabid,
      //     total: p.product_price
      //    })
      // }
      // else{
      //   if((this.tabtotal.filter(any=>any.id == tabid) as TabTotal[]).length ==0)
      //   {
      //     this.tabtotal.push({
      //       id: tabid,
      //       total: p.product_price
      //      })
      //   }
      //   else
      //   {
      //     (this.tabtotal.filter(any=>any.id == tabid) as TabTotal[])[0].total += p.product_price
      //   }
      // }

      // console.log(this.tabtotal); this.to = (this.tabtotal.filter(a=>a.id=tabid) as TabTotal[])[0].total
      this.to=sum;

      if(this.discount==undefined)
      {
        this.discount=0;
      }
      this.sub = Number(this.to)  - Number(this.discount);
      if(this.sub <= 0)
      {
        this.sub =0;
      }
    }
  }

  payandprint(){
    //check if tab exist
    this.test(this.t);
    //check if any user is selected
    if(this.u == undefined)
    {
      // this.err=[];
      // this.err.push("Please enter the target user!!");
      // alert("Please enter the target user!!");
      this.make_error('warning',"Please enter the target user!!");
    }
    else if( this.tab_arr.filter(any=>any.tab_id==this.t).length == 0)
    {
      if(this.t==undefined)
      {
        this.make_error('warning',"Please choose a tab first!");
      }
      else{
        this.make_error('warning',"Tab " +this.t+ " empty");
      }
    }
    else{
      //check if purchase quantity > stock

      // this.tab_arr.forEach(a=>{
      //   if(a.tab_id == this.t)
      //   {
      //     a.tab_product.forEach( b=>{
      //       var p = (this.allproduct.filter(any=>any.product_id == b.product_id) as  Product[])[0] as Product
      //       var pstock = p.product_stock;
      //       var pid = p.product_id;
      //       var pname = p.product_name;
      //       if(b.product_quantity > pstock){
      //         this.checkq.push("Product #"+pid+": "+pname+" doesnt have enough in stock: only "+pstock+" left.")
      //       }
      //     })
      //   }
      // })

      for(var i = 0;i < this.tab_arr.length; i++)
      {
        if(this.tab_arr[i].tab_id == this.t)
        {
          for(var j = 0; j< this.tab_arr[i].tab_product.length;j++)
          {
            var p = (this.allproduct.filter(any=>any.product_id == this.tab_arr[i].tab_product[j].product_id)[0] as Product)
            if(this.tab_arr[i].tab_product[0].product_quantity > p.product_stock)
            {
              this.checkq = [];
              console.log(this.tab_arr[i].tab_product[0].product_quantity);
              this.checkq.push("tab:"+ this.t+" Product #"+p.product_id+": "+p.product_name+" not enough in stock: only "+p.product_stock+" left.")
            }
          }
        }
      }

      //print error
      if( this.checkq.length != 0)
      {
        var err_quantity = '';
        this.checkq.forEach(c=> this.make_error('danger',c) )
        this.checkq = [];
      }
      else //if there is no error, quantity and stock are checked
      {
      
        for(var i = 0 ;i<this.tab_arr.length; i++){
          console.log("1")
          if(this.tab_arr[i].tab_id == this.t)
          {
            console.log("2")
            for(var j = 0 ; j<this.tab_arr[i].tab_product.length ; j++)
            {
              console.log("3")
              for(var k = 0; k < this.allproduct.length; k++)
              {
                console.log("4")
                if(this.tab_arr[i].tab_product[j].product_id == this.allproduct[k].product_id)
                {
                  console.log("5")
                  this.allproduct[k].product_stock -= this.tab_arr[i].tab_product[j].product_quantity;
                  this.allproduct[k].product_bought += this.tab_arr[i].tab_product[j].product_quantity;
                  this.getallproductService.updateProduct(this.allproduct[k]).subscribe();
                }
              }
            }
          }
        }
        
      // window.alert("Order and stock updated sucessfully!");
            var order_id:string = "myoID";
            var total_price = this.sub;
            var total_paid = this.discount;
            var total_unpaid = this.to;
            var customer: User = this.u;
            var products:Cart[] = [];
            var created_at: string = Date();
            var updated_at: string = Date();
            var order_hash: string = (new Md5).appendStr(order_id + created_at).end().toString();
        
            for(var i = 0;i < this.tab_arr.length;i++)
            {
              if(this.tab_arr[i].tab_id == this.t && this.tab_arr[i].tab_product.length == 1)
              {
                products.push({
                  product_id: this.tab_arr[i].tab_product[0].product_id,
                  product_quantity: this.tab_arr[i].tab_product[0].product_quantity,
                })
              }
            }
            const unknOrder: unknown = {order_id,total_price,total_paid,total_unpaid,customer,products,created_at,updated_at,order_hash};
            const newOrder: Neworder = unknOrder as Neworder;
            this.getallneworderService.addNeworder(newOrder).subscribe();//update to order table
            this.removeTab(this.temporder.indexOf(this.t));
            this.removeAll(this.t);
            
         
            var url:string = "/invoice-page"+";orderid="+order_hash.toString();
            window.open(url); 
      }
      
  
     

     // window.open('invoice-page;orderid=2','blank')
    }
    
  }
  tabcolor(i:any){
    if(this.t == i)
    {
      return {
        'border': 'none !important',
      }
    }
    else{
      return {
        'border-bottom': '1px solid gray',
      }
    }
  }
  active()
  {
    if(this.t == undefined )
    {
      return {
        active: true
      }
    }
  }

  toast_type(t:string){
    if(t =='danger'){
      return {
        'callout' :true,
        'callout-danger' : true,
        'color' : 'red',
      }
    }
    else if(t == 'success')
    {
      return {
        'callout' :true,
        'callout-success' : true,
        'color' : 'green',
      }
    }
    else if(t == 'warning')
    {
      return {
        'callout' :true,
        'callout-warning' : true,
        
      }
    }
    else{
      return {
        'callout' :true,
        'callout-info' : true,
      }
    }
  }
  toast_color(t:string){
    if(t =='danger'){
      return {
        'color' : 'red',
      }
    }
    else if(t == 'success')
    {
      return {
        'color' : 'green',
      }
    }
    else if(t == 'warning')
    {
      return {
        'color' : '#D39E00',
      }
    }
    else{
      return {
        'color' : '#0F6E7D',
      }
    }
  }

  make_error(t:string,e:string){
    this.err.push({
      type: t,
      message: e
    });
    this.toast_type(t);
    this.toast_color(t);
    setTimeout(() => {
      this.err.splice(this.err.indexOf(this.err[0]),1)
     }, 5000);
    }

  dismiss_err(e:MyToast){
    this.err.splice(this.err.indexOf(e),1)
  } 
}
