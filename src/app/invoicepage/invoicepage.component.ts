import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LoginServiceService } from '../login-service.service';
import { OrderService } from '../service/order.service';
import { User } from '../model/user';
import { Neworder } from '../model/neworder';
import { Product } from '../model/product';
import { LOCAL_STORAGE, WebStorageService } from 'angular-webstorage-service';
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

    infoarr: User[] = [];
    param: any = '';

    orderlist: Neworder[] = [];
    productlist: Product[] = [];
    singleCustomer: User[] = [];
    singleOrder: Neworder[] = [];
    tempProductbyid: Product[] = [];
    CURREN_CART: Cart[] = [];
    currentDate: string[] = [];
    ha;
    PRODUCT_CART: Product[] = []; // paralel to current_cart {product_name}

    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    constructor(
        private activateRoute: ActivatedRoute,
        private getalluserService: LoginServiceService,
        private getallneworderService: NeworderService,
        private INVOICE_ROUTE: Router,
    ) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }
    ngOnInit(): void {
        this.infoarr.push(JSON.parse(localStorage.getItem('currentUser')));// admin info from localstorage
        // get customer info
        // get order info
        this.currentDate.push(Date());
        console.log(this.currentDate[0]);

        this.activateRoute.url.subscribe();
        this.param = this.activateRoute.snapshot.params.orderid;

        this.getallorder();
        this.getallproduct();
        // param is the order id
        this.GET_ORDER_AND_BUYER();
        console.log('param is ' + this.param);
    }

    async getallorder(): Promise<void> {
        this.orderlist = await this.getallneworderService.getNeworder().toPromise()
        this.ha = (this.orderlist.filter(a => a.order_hash === this.param) as Neworder[])[0].order_id;
    }

    getallproduct(): void {
        this.getalluserService.getProduct().subscribe(
            (data: any[]) => (this.productlist = data)
        )
    }

    async GET_ORDER_AND_BUYER(): Promise<void> {
        this.orderlist = await this.getallneworderService.getNeworder().toPromise()

        if (this.param === undefined || (this.orderlist.filter(a => a.order_hash === this.param) as Neworder[]).length === 0) {
            this.INVOICE_ROUTE.navigate(['pagenotfound']);
        }
        else {
            this.ha = (this.orderlist.filter(a => a.order_hash === this.param) as Neworder[])[0].order_id;
            // tslint:disable-next-line: no-var-keyword
            for (var i = 0; i < this.orderlist.length; i++) {
                if (this.orderlist[i].order_id === this.ha) {
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
            });
            // tslint:disable-next-line: no-var-keyword
            for (var i = 0; i < (this.singleOrder[0].products).length; i++) {
                this.CURREN_CART.push({
                    product_id: (this.singleOrder[0].products[i] as Cart).product_id,
                    product_quantity: (this.singleOrder[0].products[i] as Cart).product_quantity
                })
            }
            for (var i = 0; i < this.CURREN_CART.length; i++) {
                for (var j = 0; j < this.productlist.length; j++) {
                    if (this.CURREN_CART[i].product_id === this.productlist[j].product_id) {
                        this.PRODUCT_CART.push({
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
            console.log(this.CURREN_CART);
            console.log(this.PRODUCT_CART);
            console.log(this.singleOrder);
            console.log(this.singleCustomer);

            this.printpdf();
        }
    }

    GET_PRODUCT_BY_ID(id: any): void {
        for (var i = 0; i < this.productlist.length; i++) {
            if (this.productlist[i].product_id === id) {
                this.tempProductbyid.push({
                    product_id: this.productlist[i].product_id,
                    product_name: this.productlist[i].product_name,
                    product_price: this.productlist[i].product_price,
                    product_img: this.productlist[i].product_img,
                    product_stock: this.productlist[i].product_stock,
                    product_bought: this.productlist[i].product_bought,
                    product_created_at: this.productlist[i].product_created_at,
                    product_updated_at: this.productlist[i].product_updated_at,
                });
            }
        }
    }


    public printpdf(): void {
        setTimeout(() => {
            window.print();
        }, 3000);
    }

    public printpdfisntant(): void {
        window.print();
    }
}
