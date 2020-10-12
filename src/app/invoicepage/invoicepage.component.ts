import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LoginServiceService } from '../service/login/login-service.service';
import { AdminService } from '../service/admin/admin.service';
import { UserService } from '../service/user/user.service';
import { ProductService } from '../service/product/product.service';
import { NeworderService } from '../service/neworder/neworder.service';

import { Admin } from '../model/admin';
import { User } from '../model/user';
import { Product } from '../model/product';
import { Neworder } from '../model/neworder';
import { MyToast } from '../model/Mytoast';

import { LOCAL_STORAGE, WebStorageService } from 'angular-webstorage-service';
import { BehaviorSubject, Observable } from 'rxjs';
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

    private currentAdminSubject: BehaviorSubject<Admin>;
    public currentAdmin: Observable<Admin>;
    constructor(
        private activateRoute: ActivatedRoute,
        private getAdminService: AdminService,
        private getUserService: UserService,
        private getProductService: ProductService,
        private getNeworderService: NeworderService,
        private invoiceRoute: Router,
    ) {
        this.currentAdminSubject = new BehaviorSubject<Admin>(JSON.parse(localStorage.getItem('currentAdmin')));
        this.currentAdmin = this.currentAdminSubject.asObservable();
    }
    ngOnInit(): void {
        this.infoarr.push(JSON.parse(localStorage.getItem('currentAdmin'))); // admin info from localstorage
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
        console.log(this.param);
    }

    async getallorder(): Promise<void> {
        this.orderlist = await this.getNeworderService.getNeworder().toPromise();
    }

    getallproduct(): void {
        this.getProductService.getProduct().subscribe(
            (data: any[]) => (this.productlist = data)
        );
    }

    async GET_ORDER_AND_BUYER(): Promise<void> {
        this.orderlist = await this.getNeworderService.getNeworder().toPromise();

        if (this.param === undefined || (this.orderlist.filter(a => a.order_hash === this.param) as Neworder[]).length === 0) {
            this.invoiceRoute.navigate(['pagenotfound']);
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
                user_id: this.singleOrder[0].customer.user_id,
                user_name: this.singleOrder[0].customer.user_name,
                user_email: this.singleOrder[0].customer.user_email,
                user_password: this.singleOrder[0].customer.user_password,
                is_login: this.singleOrder[0].customer.is_login,
                user_role: this.singleOrder[0].customer.user_role,
                user_hash_id: this.singleOrder[0].customer.user_hash_id,
                created_at: this.singleOrder[0].customer.created_at,
                updated_at: this.singleOrder[0].customer.updated_at,
                user_img: this.singleOrder[0].customer.user_img,
                user_telephone: this.singleOrder[0].customer.user_telephone,
                user_dob: this.singleOrder[0].customer.user_dob,
                user_gender: this.singleOrder[0].customer.user_gender,
                user_address: this.singleOrder[0].customer.user_address,
                user_tag: this.singleOrder[0].customer.user_tag,
                additional_info: this.singleOrder[0].customer.additional_info
            });
            // tslint:disable-next-line: no-var-keyword
            for (var i = 0; i < (this.singleOrder[0].products).length; i++) {
                this.CURREN_CART.push({
                    product_hash_id: (this.singleOrder[0].products[i] as Cart).product_hash_id,
                    product_quantity: (this.singleOrder[0].products[i] as Cart).product_quantity,
                    cart_info: '',
                })
            }
            for (var i = 0; i < this.CURREN_CART.length; i++) {
                for (var j = 0; j < this.productlist.length; j++) {
                    if (this.CURREN_CART[i].product_hash_id === this.productlist[j].product_hash_id) {
                        this.PRODUCT_CART.push({
                            product_id: this.productlist[j].product_id,
                            product_name: this.productlist[j].product_name,
                            product_price: this.productlist[j].product_price,
                            product_img: this.productlist[j].product_img,
                            product_stock: this.productlist[i].product_stock,
                            product_bought: this.productlist[i].product_bought,
                            product_created_at: this.productlist[i].product_created_at,
                            product_updated_at: this.productlist[i].product_updated_at,
                            product_hash_id: this.productlist[i].product_hash_id,
                            product_prime_cost: this.productlist[i].product_prime_cost,
                            product_category: this.productlist[i].product_category,
                            product_weight: this.productlist[i].product_weight,
                            product_description: this.productlist[i].product_description,
                            product_branch: this.productlist[i].product_branch,
                            product_tag: this.productlist[i].product_tag,
                            additional_info: this.productlist[i].additional_info,
                            product_barcode: this.productlist[i].product_barcode,
                            product_unit: this.productlist[i].product_unit,
                            product_brand: this.productlist[i].product_brand,
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

    public printpdf(): void {
        setTimeout(() => {
            window.print();
        }, 3000);
    }

    public printpdfisntant(): void {
        window.print();
    }
}
