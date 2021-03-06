import { AfterViewInit, Component, OnInit, ViewChild, ɵConsole, ElementRef } from '@angular/core';
import { AdminService } from '../service/admin/admin.service';
import { UserService } from '../service/user/user.service';
import { ProductService } from '../service/product/product.service';
import { NeworderService } from '../service/neworder/neworder.service';
import { BranchService } from '../service/branch/branch.service';
import { ProducttagService } from '../service/producttag/producttag.service';

import { Admin } from '../model/admin';
import { User } from '../model/user';
import { Product } from '../model/product';
import { Neworder } from '../model/neworder';
import { Branch } from '../model/branch';
import { MyToast } from '../model/Mytoast';
import { ProductTag } from '../model/productTag';

import { LOCAL_STORAGE, WebStorageService } from 'angular-webstorage-service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Output, Input, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { Cart } from '../model/cart';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { removeData, type } from 'jquery';
import { stringify } from 'querystring';
import { getHtmlTagDefinition, ThrowStmt, viewClassName } from '@angular/compiler';
import { Hash } from 'crypto';
import { Md5 } from 'ts-md5/dist/md5';
import { color } from 'html2canvas/dist/types/css/types/color';
import { LoginServiceService } from '../service/login/login-service.service';
import { string } from 'src/assets/plugins/jszip/jszip';
import { ProductPurchase } from '../model/productpurchase';

export interface TabID {
    tab_id: number;
    tab_product: Cart[];
    tab_price: number;
    tab_total: number;

}
export interface TabTotal {
    id: number;
    total: number;
}
export interface TabPayment {
    tab_id: number;
    tab_pay: number;
    tab_cash: number;
    tab_card: number;
    tab_bank: number;
    tab_change: number;
}

@Component({
    selector: 'app-sale',
    templateUrl: './sale.component.html',
    styleUrls: ['./sale.component.css']
})
export class SaleComponent implements OnInit {
    math = Math;
    infoarr: Admin[] = [];
    alluser: User[] = [];
    allproduct: Product[] = [];
    allneworder: Neworder[] = [];
    allbranch: Branch[] = [];
    allTag: ProductTag[] = [];
    tempListPurchase: ProductPurchase[] = [];
    tabPaymentlist: TabPayment[] = [];

    tempneworder: Neworder[] = [];
    productlist: Product[] = [];
    PNAME_ARR: Product[] = []; // arr of product name
    PID_ARR: Product[] = []; // arr of product id
    PSET_ARR: Product[] = []; // arr after unique concat pname pid
    err: MyToast[] = [];
    PRODUCT_MOST_STOCK: Product[] = [];
    PRODUCT_MOST_BOUGHT: Product[] = [];
    t = 1;
    u;
    discount;
    sub;
    to;
    qty;
    searchProduct;
    searchList;
    searchTerm;
    CHOSEN_PROPERTY = '';
    PRODUCT_SORT = undefined;
    shipOptionModel;
    shipFeeModel;
    taxModel;
    discountType = true;
    infoModel;
    branchModel;
    employee;
    paymentOptionModel;
    amountReceiveModel = 0;
    changeModel;
    paymentTotal;
    cashModel;
    cardModel;
    bankModel;

    proSize = true;
    imgSize = true;
    productArraySize = 20;

    temporder: any[] = [1];
    TAB_ARR: TabID[] = [];
    tabtotal: TabTotal[] = [];
    checkq: string[] = [];
    private currentAdminSubject: BehaviorSubject<Admin>;
    public currentAdmin: Observable<Admin>;
    constructor(
        private getAdminService: AdminService,
        private getUserService: UserService,
        private getProductService: ProductService,
        private getNeworderService: NeworderService,
        private getBranchService: BranchService,
        private routeLogout: Router,
        private logoutService: LoginServiceService,
        private getProductTagService: ProducttagService,
    ) {
        this.currentAdminSubject = new BehaviorSubject<Admin>(JSON.parse(localStorage.getItem('currentAdmin')));
        this.currentAdmin = this.currentAdminSubject.asObservable();
    }

    ngOnInit(): void {
        this.infoarr.push(JSON.parse(localStorage.getItem('currentAdmin')));
        console.log(this.infoarr[0]);
        this.getNeworderService.getNeworder().subscribe(
            (data: any[]) => (this.allneworder = data)
        );
        this.getAll();
        this.getAllproduct();
        this.getAllBranch();
        this.shipOptionModel = 'Pickup at store';
        this.paymentOptionModel = 'Cash';
        this.getallTag();
        // const returnFunc = synapseThrow();
    }
    setDiscountType(): void {
        if (!this.discountType) {
            this.discountType = true;
        }
        else {
            this.discountType = false;
        }
    }

    blur_discount_tax(): void {
        if (this.discount === undefined || this.discount === '' || this.discount < 0) {
            this.discount = 0;
        }

        if (this.taxModel === undefined || this.taxModel === '' || this.taxModel < 0) {
            this.taxModel = 0;
        }
        else if (this.taxModel > 100) {
            this.taxModel = 100;
        }

        if (this.shipOptionModel !== 'Delivery') {
            this.shipFeeModel = 0;
        }
        else if (this.shipFeeModel === undefined || this.shipFeeModel === '' || this.shipFeeModel < 0) {
            this.shipFeeModel = 0;
        }

        if (this.discountType) {
            if (this.discount >= this.to) {
                this.discount = this.to;
                this.sub = 0;
            }
            else {
                this.sub = (Number(this.to) - Number(this.discount)) * (Number(this.taxModel) + 100) / 100 + Number(this.shipFeeModel);
            }
        }
        else {
            if (this.discount > 100) {
                this.discount = 100;
                this.sub = 0;
            }
            else {
                this.sub = (Number(this.to) * (100 - Number(this.discount)) / 100) *
                    (Number(this.taxModel) + 100) / 100 + Number(this.shipFeeModel);
            }
        }
        if (this.sub <= 0) {
            this.sub = 0;
        }



        this.calculatePaymentTotal();
        var tb = (this.tabPaymentlist.filter(a => a.tab_id === this.t) as TabPayment[])[0];
        console.log(this.tabPaymentlist);
        console.log(this.t);
        if (tb.tab_cash === undefined) { tb.tab_cash = 0; }
        if (tb.tab_bank === undefined) { tb.tab_bank = 0; }
        if (tb.tab_card === undefined) { tb.tab_card = 0; }

        if (tb.tab_bank === 0 && tb.tab_card === 0) {
            this.changeModel = this.cashModel - this.sub;
        }
        else if (tb.tab_bank === 0 && tb.tab_cash === 0 && tb.tab_card > 0) {
            this.changeModel = this.cardModel - this.sub;
        }
        else if (tb.tab_card === 0 && tb.tab_cash === 0 && tb.tab_bank > 0) {
            this.changeModel = this.bankModel - this.sub;
        }
        else {
            this.changeModel = this.paymentTotal - this.sub;
        }
        console.log(this.changeModel);
    }

    ADD_AND_MINUS(property: string, item: TabID, pro: Cart): void {

        const P_QTY = ((this.TAB_ARR
            .filter(a => a.tab_id === item.tab_id)
            .filter(a => a.tab_product.length === 1)
            .filter(a => a.tab_product[0].product_hash_id === pro.product_hash_id) as TabID[])[0].tab_product as Cart[])[0].product_quantity;
        if (property === 'add') {
            ((this.TAB_ARR
                .filter(a => a.tab_id === item.tab_id)
                .filter(a => a.tab_product.length === 1)
                .filter(a => a.tab_product[0].product_hash_id === pro.product_hash_id) as TabID[])[0].tab_product as Cart[])[0].product_quantity += 1;
            const P_ID = ((this.TAB_ARR
                .filter(a => a.tab_id === item.tab_id)
                .filter(a => a.tab_product.length === 1)
                .filter(a => a.tab_product[0].product_hash_id === pro.product_hash_id) as TabID[])[0].tab_product as Cart[])[0].product_hash_id;
            const P_TOTAL = (this.allproduct.filter(a => a.product_hash_id === pro.product_hash_id) as Product[])[0].product_price;
            (this.tabtotal
                .filter(a => a.id === item.tab_id) as TabTotal[])
                .sort((a, b) => a.total > b.total ? -1 : 1)[0].total
                += Number(P_TOTAL);
            this.to = Number(this.to) + Number(P_TOTAL);
            this.blur_discount_tax();
        }
        else if (P_QTY > 1 && property === 'minus') {
            ((this.TAB_ARR
                .filter(a => a.tab_id === item.tab_id)
                .filter(a => a.tab_product.length === 1)
                .filter(a => a.tab_product[0].product_hash_id === pro.product_hash_id) as TabID[])[0].tab_product as Cart[])[0].product_quantity -= 1;
            const P_ID = ((this.TAB_ARR
                .filter(a => a.tab_id === item.tab_id)
                .filter(a => a.tab_product.length === 1)
                .filter(a => a.tab_product[0].product_hash_id === pro.product_hash_id) as TabID[])[0].tab_product as Cart[])[0].product_hash_id;
            const P_TOTAL = (this.allproduct.filter(a => a.product_hash_id === pro.product_hash_id) as Product[])[0].product_price;
            (this.tabtotal
                .filter(a => a.id === item.tab_id) as TabTotal[])
                .sort((a, b) => a.total > b.total ? -1 : 1)[0].total
                -= Number(P_TOTAL);
            this.to = Number(this.to) - Number(P_TOTAL);
            this.blur_discount_tax();
        }
        else { // when quantity at 1
            this.remove_tabproduct(item, pro);
        }
        this.test(this.t);
    }
    remove_tabproduct(item: TabID, pro: Cart): void {   // remove tab by tabid and product id

        for (var i = 0; i < this.TAB_ARR.length; i++) {
            if (this.TAB_ARR[i].tab_id === item.tab_id) {
                if (this.TAB_ARR[i].tab_product.length === 0) {
                    this.TAB_ARR.splice(i, 1);
                    i -= 1;
                }
                else if (this.TAB_ARR[i].tab_product[0].product_hash_id === pro.product_hash_id) {
                    this.to = Number(this.to) -
                        (this.TAB_ARR[i].tab_product[0].product_quantity *
                            (this.allproduct.filter(a => a.product_hash_id === pro.product_hash_id) as Product[])[0].product_price);
                    if (this.discount === undefined) {
                        this.discount = 0;
                    }
                    this.sub = Number(this.to) - Number(this.discount);
                    if (this.sub <= 0) {
                        this.sub = 0;
                    }
                    this.TAB_ARR.splice(i, 1);
                    i -= 1;
                }
            }
        }
        this.make_error('info', 'Removed item id#' + String(pro.product_hash_id) + ' from tab ' + item.tab_id.toString());
    }
    find_product(p: any): void {
        this.chooseProduct(p);
        this.searchTerm = '#' + String(p.product_hash_id) + ': ' + p.product_name;
        this.PSET_ARR = [];
    }
    input_onblur(): void {
        this.PSET_ARR = [];
    }
    input_close(): void {
        this.searchTerm = '';
        this.input_focus();
    }
    input_focus(): object {
        this.search();

        if (typeof (this.searchTerm) === 'string' && this.searchTerm !== '') {
            return {
                'shadow': true,
            }
        }
    }
    input_blur(): void {
        this.searchTerm = '';
    }
    search(): void {
        if (this.searchTerm !== '') {
            const term = String(this.searchTerm).toLowerCase();
            this.PNAME_ARR = [];
            this.PID_ARR = [];
            // tslint:disable-next-line: only-arrow-functions
            this.PNAME_ARR = this.allproduct.filter(function (s): boolean { return s.product_name.includes(term); });
            // tslint:disable-next-line: only-arrow-functions
            this.PID_ARR = this.allproduct.filter(function (s): boolean { return s.product_hash_id.includes(term); });

            this.PSET_ARR = [];
            const newset = new Set(this.PNAME_ARR.concat(this.PID_ARR));
            const myset = Array.from(newset);
            this.PSET_ARR = myset as Product[];
            this.PSET_ARR.sort();
            console.log(this.PSET_ARR);
        }
        else {
            this.PSET_ARR = [];
        }
    }
    total(s: any): void {
        console.log(s + 'and' + this.to);
    }
    change(u: any): void {
        this.make_error('success', 'User' + u.user_name + ' chosen!');
        console.log(this.u.user_id + 'and' + u.user_name);
    }
    shipOptionAlert(s: any): void {
        if (s === 'Pickup at store') { this.shipFeeModel = 0; }
        this.blur_discount_tax();
        this.make_error('success', s + ' chosen!');
    }
    getAll(): void {
        this.getUserService.getUser()
            .subscribe(
                (data: any[]) => (this.alluser = data)
            );
    }
    // get list products
    getAllproduct(): void {
        this.getProductService.getProduct().subscribe(
            (data: any[]) => (
                this.allproduct = data,
                this.productlist = data
            )
        );
    }
    getAllBranch(): void {
        this.getBranchService.getBranch()
            .subscribe(
                (data: any[]) => (this.allbranch = data)
            );
    }
    getallTag(): void {
        this.getProductTagService.getProductTag().subscribe((dataT: any[]) => this.allTag = dataT);
    }
    sort_by_product(property: string): void {
        this.CHOSEN_PROPERTY = property;

        if (this.CHOSEN_PROPERTY === 'product_stock' ||
            this.CHOSEN_PROPERTY === 'product_bought' ||
            this.CHOSEN_PROPERTY === 'product_id' ||
            this.CHOSEN_PROPERTY === 'product_updated_at') // parse and sort number
        {
            if (this.PRODUCT_SORT) {
                this.allproduct.sort((a, b) => parseFloat(a[property]) < parseFloat(b[property]) ? -1 : 1);
                this.PRODUCT_SORT = false;
            }
            else {
                this.allproduct.sort((a, b) => parseFloat(a[property]) > parseFloat(b[property]) ? -1 : 1);
                this.PRODUCT_SORT = true;
            }
        }
        else {
            if (this.PRODUCT_SORT) {
                this.allproduct.sort((a, b) => String(a[property]).toLowerCase() < String(b[property]).toLowerCase() ? -1 : 1);
                this.PRODUCT_SORT = false;
            }
            else {
                this.allproduct.sort((a, b) => String(a[property]).toLowerCase() > String(b[property]).toLowerCase() ? -1 : 1);
                this.PRODUCT_SORT = true;
            }
        }
    }
    test(a: any): void { // refresh tab
        this.t = a;
        this.tabcolor(a);
        if (this.to === undefined) {
            this.to = 0;
        }
        if (this.discount === undefined || this.discount === '') {
            this.discount = 0;
        }

        // if((this.tabtotal.filter(any=>any.id == this.t) as TabTotal[]).length == 0)
        // {
        //   this.to = 0
        // }
        // else{
        //   this.to = (this.tabtotal.filter(any=>any.id == this.t) as TabTotal[])[0].total;
        // }
        this.to = 0;
        this.TAB_ARR.forEach(t => {
            if (t.tab_id === this.t && t.tab_product.length === 1) {
                this.to = Number(this.to) +
                    t.tab_product[0].product_quantity *
                    (this.allproduct.filter(b => b.product_hash_id === t.tab_product[0].product_hash_id) as Product[])[0].product_price;
            }
        });

        var tpl = (this.tabPaymentlist.filter(b => b.tab_id === this.t) as TabPayment[])[0];
        this.cashModel = tpl.tab_cash;
        this.cardModel = tpl.tab_card;
        this.bankModel = tpl.tab_bank;
        this.blur_discount_tax();
    }
    addTab(): void {
        let tempc = 1;
        while (this.temporder.includes(tempc)) {
            tempc++;
        }
        this.t = tempc;
        this.temporder.push(tempc);

        console.log(this.t);
        if (this.tabPaymentlist.filter(a => a.tab_id === this.t).length === 0) {
            this.tabPaymentlist.push({
                tab_id: this.t,
                tab_pay: 0,
                tab_cash: 0,
                tab_card: 0,
                tab_bank: 0,
                tab_change: 0,
            });
        }
    }
    removeTab(x: number): void {
        if (this.t === x) {
            this.t = this.temporder[x - 1];
        }
        this.temporder.splice(x, 1);
        console.log('order in array' + x);
        console.log(this.temporder);
    }
    removeAll(tab: number): void {
        for (var i = this.TAB_ARR.length - 1; i >= 0; i--) {
            if (tab === this.TAB_ARR[i].tab_id) {
                this.TAB_ARR.splice(this.TAB_ARR.indexOf(this.TAB_ARR[i]), 1);
            }
        }

        for (var i = 0; i < this.tabtotal.length; i++) {
            if (this.tabtotal[i].id === tab) {
                this.tabtotal.splice(this.tabtotal.indexOf(this.tabtotal[i]), 1);
            }
        }

        if (this.tabPaymentlist.filter(a => a.tab_id === tab).length === 1) {
            this.tabPaymentlist.splice(
                this.tabPaymentlist.indexOf((this.tabPaymentlist.filter(a => a.tab_id === tab) as TabPayment[])[0]), 1);
        }
        console.log(this.tabPaymentlist)
    }
    chooseProduct(p: Product): void {
        const tabid = this.t;
        const productid = p.product_hash_id;
        let productqty = 1;
        let sum = 0;
        if (this.t === undefined) {
            this.make_error('warning', 'Please choose a tab first!!!');
        }
        else if (this.temporder.length === 0) {
            this.make_error('warning', 'Please add a tab first!!!');
        }
        else if (this.t !== undefined) {
            for (var i = 0; i < this.TAB_ARR.length; i++) {
                if (tabid === this.TAB_ARR[i].tab_id) {
                    // tslint:disable-next-line: prefer-for-of
                    for (var j = 0; j < this.TAB_ARR[i].tab_product.length; j++) {
                        if (productid === this.TAB_ARR[i].tab_product[j].product_hash_id) {
                            productqty += this.TAB_ARR[i].tab_product[j].product_quantity;
                            this.TAB_ARR[i].tab_product.splice(this.TAB_ARR[i].tab_product.indexOf(this.TAB_ARR[i].tab_product[j], 1));
                        }
                    }
                }
            }
            if (this.TAB_ARR.filter(item => item.tab_id === this.t).length === 0) {
                sum = p.product_price;
            }
            else {
                sum = this.TAB_ARR.filter(item => item.tab_id === this.t)
                    .reduce((s, current) => s = p.product_price + current.tab_total, 0);
                // only if tabid exists
            }

            this.TAB_ARR.push({
                tab_id: tabid,
                tab_product: [{
                    product_hash_id: productid,
                    product_quantity: productqty,
                    cart_info: '',
                }],
                tab_price: (productqty * p.product_price),
                tab_total: sum,
            });
            this.tabtotal.push({
                id: tabid,
                total: p.product_price
            });
            for (var i = 0; i < this.tabtotal.length; i++) {
                if (this.tabtotal[i].id === this.t) {
                    this.tabtotal.splice(this.tabtotal.indexOf(this.tabtotal[i]), 2);
                }
            }
            if (this.tabPaymentlist.filter(a => a.tab_id === this.t).length === 0) {
                this.tabPaymentlist.push({
                    tab_id: this.t,
                    tab_pay: 0,
                    tab_cash: 0,
                    tab_card: 0,
                    tab_bank: 0,
                    tab_change: 0,
                });
            }

            this.tabtotal.push({
                id: tabid,
                total: sum
            });
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
            this.to = sum;
            this.blur_discount_tax();
            console.log(this.TAB_ARR);
            this.test(this.t);
        }
    }

    payandprint(): void {
        // check if tab exist
        this.test(this.t);

        // check if any user is selected
        if (this.u === undefined) {
            // this.err=[];
            // this.err.push("Please enter the target user!!");
            // alert("Please enter the target user!!");
            this.make_error('warning', 'Please enter the target user!!');
        }
        else if (this.TAB_ARR.filter(a => a.tab_id === this.t).length === 0) {
            if (this.t === undefined) {
                this.make_error('warning', 'Please choose a tab first!');
            }
            else {
                this.make_error('warning', 'Tab' + this.t + ' empty');
            }
        }
        else {
            // check if purchase quantity > stock

            // this.TAB_ARR.forEach(a=>{
            //   if(a.tab_id == this.t)
            //   {
            //     a.tab_product.forEach( b=>{
            //       var p = (this.allproduct.filter(any=>any.product_hash_id == b.product_hash_id) as  Product[])[0] as Product
            //       var pstock = p.product_stock;
            //       var pid = p.product_hash_id;
            //       var pname = p.product_name;
            //       if(b.product_quantity > pstock){
            //         this.checkq.push("Product #"+pid+": "+pname+" doesnt have enough in stock: only "+pstock+" left.")
            //       }
            //     })
            //   }
            // })

            for (var i = 0; i < this.TAB_ARR.length; i++) {
                if (this.TAB_ARR[i].tab_id === this.t) {
                    for (var j = 0; j < this.TAB_ARR[i].tab_product.length; j++) {
                        const p = (this.allproduct.filter(a => a.product_hash_id === this.TAB_ARR[i].tab_product[j].product_hash_id)[0] as Product);
                        if (this.TAB_ARR[i].tab_product[0].product_quantity > p.product_stock) {
                            this.checkq = [];
                            console.log(this.TAB_ARR[i].tab_product[0].product_quantity);
                            this.checkq.push('tab:' + this.t +
                                ' Product #' + p.product_hash_id +
                                ': ' + p.product_name +
                                ' not enough in stock: only ' + p.product_stock + ' left.');
                        }
                    }
                }
            }

            // print error
            if (this.checkq.length !== 0) {
                this.checkq.forEach(c => this.make_error('danger', c));
                this.checkq = [];
            }
            else if (this.branchModel === undefined || this.shipOptionModel === undefined || this.paymentOptionModel === undefined) {
                if (this.branchModel === undefined) { this.make_error('danger', 'Please select a branch first!'); }
                if (this.shipOptionModel === undefined) { this.make_error('danger', 'Please select a ship option!'); }
                if (this.paymentOptionModel === undefined) { this.make_error('danger', 'Please select a payment option!'); }
            }
            else // if there is no error, quantity and stock are checked
            {
                for (var i = 0; i < this.TAB_ARR.length; i++) {
                    if (this.TAB_ARR[i].tab_id === this.t) {
                        for (var j = 0; j < this.TAB_ARR[i].tab_product.length; j++) {
                            // tslint:disable-next-line: no-var-keyword
                            for (var k = 0; k < this.allproduct.length; k++) {
                                if (this.TAB_ARR[i].tab_product[j].product_hash_id === this.allproduct[k].product_hash_id) {
                                    this.allproduct[k].product_stock -= this.TAB_ARR[i].tab_product[j].product_quantity;
                                    this.allproduct[k].product_bought += this.TAB_ARR[i].tab_product[j].product_quantity;
                                    this.getProductService.updateProduct(this.allproduct[k]).subscribe();
                                }
                            }
                        }
                    }
                }
                // window.alert("Order and stock updated sucessfully!");


                const orderID = 'myoID';
                const orderSubtotal = this.to;
                const orderDiscount = this.discount;
                const orderTotal = Number((Math.ceil(Number(this.sub) * 100) / 100).toFixed(2));



                const products1: Cart[] = [];
                const createdAt = Date();
                const updatedAt = Date();
                // tslint:disable-next-line: new-parens
                const orderHashID: string = (new Md5).appendStr(orderID + createdAt).end().toString();
                const customer1: User = this.u;
                let orderShipFee;
                if (this.shipOptionModel !== 'Delivery') { orderShipFee = 0; }
                else { orderShipFee = this.shipFeeModel; }
                const orderTax = this.taxModel;
                const orderPaymentOption = [
                    { payment_option: 'Cash', payment_value: this.cashModel },
                    { payment_option: 'Card', payment_value: this.cardModel },
                    { payment_option: 'Bank', payment_value: this.bankModel }];

                const orderBranch = this.branchModel as Branch;
                const orderTag = [];
                const orderShipOption = this.shipOptionModel;
                const orderStatus = [];
                const orderDelivertyTime = Date();
                const additionalInfo = this.infoModel;
                const orderSalePerson = this.infoarr[0] as Admin;
                let typeDiscount;
                const orderAddress = '';
                const orderPaid = this.paymentTotal;
                const orderChange = this.changeModel;

                if (this.discountType) { typeDiscount = 'amount'; }
                else { typeDiscount = 'percentage'; }

                for (var i = 0; i < this.TAB_ARR.length; i++) {
                    if (this.TAB_ARR[i].tab_id === this.t && this.TAB_ARR[i].tab_product.length === 1) {
                        products1.push({
                            product_hash_id: this.TAB_ARR[i].tab_product[0].product_hash_id,
                            product_quantity: this.TAB_ARR[i].tab_product[0].product_quantity,
                            cart_info: '',
                        });
                    }
                }
                // set a tag for each purchased product
                const newTagHash = (new Md5()).appendStr('Ban hang' + createdAt.toString()).end().toString();
                for (var i = 0; i < products1.length; i++) {
                    for (var j = 0; j < this.allproduct.length; j++) {
                        if (products1[i].product_hash_id === this.allproduct[j].product_hash_id) {
                            this.tempListPurchase.push({
                                product_object: this.allproduct[j],
                                product_quantity: products1[i].product_quantity,
                                total_primecost: this.allproduct[j].product_prime_cost * products1[i].product_quantity,
                            });
                            this.allproduct[j].product_tag.push(newTagHash);
                            this.getProductService.updateProduct(this.allproduct[j]).subscribe();
                        }
                    }
                }
                // const tempTag: ProductTag = {
                //     tag_id: 'mytagid',
                //     tag_hash_id: newTagHash,
                //     tag_product_id: products1[i].product_hash_id,
                //     tag_name: 'Ban hang',
                //     tag_quantity: products1[i].product_quantity,
                //     tag_created_at: new Date(),
                //     tag_supplier_hid: '',
                //     tag_emp_created_hid: this.infoarr[0].admin_hash_id,
                //     tag_emp_updated_hid: this.infoarr[0].admin_hash_id,
                //     tag_branch_id: (this.branchModel as Branch).branch_hash_id,
                //     tag_info: '',
                //     tag_price: this.allproduct[j].product_price * products1[i].product_quantity,
                //     tag_paid: orderPaid,
                //     tag_user_id: customer1.user_hash_id,
                //     tag_order_id: orderHashID,
                //     tag_discount_amount: null,
                //     tag_updated_at: new Date(),
                // };
                // this.getProductTagService.addProductTag(tempTag).subscribe();
                // this.allproduct[j].product_tag.push(tempTag);
                var unkwTag = {
                    tag_id: 'mytagid',
                    tag_hash_id: newTagHash,
                    tag_new_product: this.tempListPurchase,
                    tag_name: 'Ban hang',
                    tag_created_at: new Date(),
                    tag_updated_at: new Date(),
                    tag_supplier_hid: '',
                    tag_emp_created_hid: this.infoarr[0].admin_hash_id,
                    tag_emp_updated_hid: this.infoarr[0].admin_hash_id,
                    tag_branch_id: 'this branch',
                    tag_info: '',
                    tag_user_id: customer1.user_hash_id,
                    tag_order_id: orderHashID,
                    tag_discount_amount: 0,
                } as ProductTag;
                this.getProductTagService.addProductTag(unkwTag).subscribe();
                const unknOrder: unknown =
                {
                    order_id: orderID,
                    order_subtotal: orderSubtotal,
                    order_discount: orderDiscount,
                    order_total: orderTotal,
                    customer: customer1,
                    products: products1,
                    created_at: createdAt,
                    updated_at: updatedAt,
                    order_hash: orderHashID,
                    order_shipfee: orderShipFee,
                    order_tax: orderTax,
                    order_payment_option: orderPaymentOption,
                    order_branch: orderBranch,
                    order_tag: orderTag,
                    order_ship_option: orderShipOption,
                    order_status: orderStatus,
                    order_delivery_time: orderDelivertyTime,
                    additional_info: additionalInfo,
                    order_sale_person: orderSalePerson,
                    order_discount_type: typeDiscount,
                    order_address: orderAddress,
                    order_paid: orderPaid,
                    order_change: orderChange,
                };
                const newOrder: Neworder = unknOrder as Neworder;
                this.getNeworderService.addNeworder(newOrder).subscribe(); // update to order table
                this.removeTab(this.temporder.indexOf(this.t));
                this.removeAll(this.t);
                const url = '/invoice-page' + ';orderid=' + orderHashID.toString();
                window.open(url);
            }
            // window.open('invoice-page;orderid=2','blank')
        }
    }
    tabcolor(i: any): object {
        if (this.t === i) {
            return {
                ' border': 'none !important',
            };
        }
        else {
            return {
                'border-bottom': '1px solid gray',
            };
        }
    }
    active(): object {
        if (this.t === undefined) {
            return {
                active: true,
            };
        }
    }

    toast_type(t: string): object {
        if (t === 'danger') {
            return {
                'callout': true,
                'callout-danger': true,
                'color': 'red',
            };
        }
        else if (t === 'success') {
            return {
                'callout': true,
                'callout-success': true,
                'color': 'green',
            };
        }
        else if (t === 'warning') {
            return {
                'callout ': true,
                'callout-warning': true,
            };
        }
        else {
            return {
                'callout': true,
                'callout-info': true,
            };
        }
    }
    toast_color(t: string): object {
        if (t === 'danger') {
            return {
                'color': 'red',
            };
        }
        else if (t === 'success') {
            return {
                'color': 'green',
            };
        }
        else if (t === 'warning') {
            return {
                'color': '#D39E00',
            };
        }
        else {
            return {
                'color': '#0F6E7D',
            };
        }
    }

    make_error(t: string, e: string): void {
        this.err.push({
            type: t,
            message: e
        });
        this.toast_type(t);
        this.toast_color(t);
        setTimeout(() => {
            this.err.splice(this.err.indexOf(this.err[0]), 1);
        }, 5000);
    }

    dismiss_err(e: MyToast): void {
        this.err.splice(this.err.indexOf(e), 1);
    }

    addNewOrderUser(
        name: string, id: string, telephone: string,
        address: string, email: string, role: string,
        dob: Date, gender: string, info: string): void {

        const u = this.alluser.filter(x => x.user_hash_id === id) as User[];
        if (u.length === 1) {
            const existUser: User = u[0];
            if (name !== '') { existUser.user_name = name; }
            if (address !== '') {
                if (existUser.user_address.filter(x => x === address)[0].length === 0) {
                    existUser.user_address.push(address);
                }
            }
            if (role !== '') { existUser.user_role = role; }
            if (dob.toString() !== '') { existUser.user_dob = dob; }
            if (gender !== '') { existUser.user_gender = gender; }
            if (info !== '') { existUser.additional_info = info; }

            if (email !== '' || telephone !== '') {
                if (this.alluser.filter(a => a.user_email === email).length > 0) {
                    this.make_error('danger', 'This email has been registered!');
                }
                else if (this.alluser.filter(a => a.user_telephone === telephone).length > 0) {
                    this.make_error('danger', 'This telephone has been registered!');
                }
                else {
                    if (telephone !== '') { existUser.user_telephone = telephone; }
                    if (email !== '') { existUser.user_email = email; }

                    this.u = existUser;
                    this.make_error('info',
                        'Found user matches provided ID. New info will be updated.');
                    this.getUserService.updateUser(existUser).subscribe();
                }
            }
        }
        else {
            if (name === '') {
                this.make_error('danger', 'Username must be provided!');
            }
            else {
                if (telephone === '') { telephone = null; }
                if (email === '') { email = null; }
                if (role === '') { role = null; }
                if (gender === '') { gender = null; }
                if (info === '') { info = null; }
                const userID = 'myuID';
                const password = 'default-password';
                const isLogin = false;
                const createAt = Date();
                const updatedAt = Date();
                const newhash = new Md5();
                const hashID = newhash.appendStr(userID + createAt).end().toString();
                const userImg = '';
                const userAddress = [];
                if (address !== '') { userAddress.push(address); }
                const userTag = [];

                const unknUser: unknown = {
                    user_id: userID,
                    user_name: name,
                    user_email: email,
                    user_password: password,
                    is_login: isLogin,
                    user_role: role,
                    user_hash_id: hashID,
                    created_at: createAt,
                    updated_at: updatedAt,
                    user_img: userImg,
                    user_telephone: telephone,
                    user_dob: dob,
                    user_gender: gender,
                    user_address: userAddress,
                    user_tag: userTag,
                    additional_info: info,
                };
                const newUser: User = unknUser as User;
                this.getUserService.addUser(newUser).subscribe();
                this.alluser.push(newUser);
                this.u = newUser;
                this.make_error('success', 'No user found with ID provided. New user is added successfully!');
            }

        }
    }

    public clickLogout(): void {
        this.logoutService.logout();
        this.routeLogout.navigate(['login-page']);
    }
    productSize(): object {
        if (this.proSize) {
            return {
                'col-sm-2': true,
            };
        }
        else {
            return {
                'col-sm-1': true,
            };
        }
    }
    changeProSize(): void {
        if (this.proSize) {
            this.proSize = false;
        }
        else {
            this.proSize = true;
        }
        this.productSize();
    }
    imageSize(): object {
        if (!this.imgSize) {
            return {
                'height': '0',
                'width': '0'
            };
        }
        else {
            return {
                'height': 'auto',
                'width': 'auto',
            };
        }
    }
    changeImgSize(): void {
        if (this.imgSize) {
            this.imgSize = false;
        }
        else {
            this.imgSize = true;
        }
        this.imageSize();
    }
    changeArrSize(): void {
        if (this.productArraySize === 20) {
            this.productArraySize = 30;
        }
        else if (this.productArraySize === 30) {
            this.productArraySize = 40;
        }
        else if (this.productArraySize === 40) {
            this.productArraySize = 20;
        }
    }

    savePayment(currentTab: number, tabCash: number, tabCard: number, tabBank: number): void {
        const tabid = currentTab;
        if (tabCash === null || tabCash === undefined || Number(tabCash) === 0 || typeof (tabCash) !== 'number') { tabCash = 0; }
        if (tabCard === null || tabCard === undefined || Number(tabCard) === 0) { tabCard = 0; }
        if (tabBank === null || tabBank === undefined || Number(tabBank) === 0) { tabBank = 0; }

        this.tabPaymentlist.filter(a => a.tab_id === tabid)[0].tab_cash = Number(tabCash);
        this.tabPaymentlist.filter(a => a.tab_id === tabid)[0].tab_card = Number(tabCard);
        this.tabPaymentlist.filter(a => a.tab_id === tabid)[0].tab_bank = Number(tabBank);
        this.tabPaymentlist.filter(a => a.tab_id === tabid)[0].tab_pay = (tabCash + tabCard + tabBank);
        this.tabPaymentlist.filter(a => a.tab_id === tabid)[0].tab_change = (tabCash + tabCard + tabBank) - this.sub;
        this.make_error('success', 'Payment set for Order#' + currentTab.toString());
        console.log(this.tabPaymentlist);
    }

    calculatePaymentTotal(): void {
        if (this.cashModel === undefined) { this.cashModel = 0; }
        if (this.cardModel === undefined) { this.cardModel = 0; }
        if (this.bankModel === undefined) { this.bankModel = 0; }

        this.paymentTotal = Number(this.cashModel) + Number(this.cardModel) + Number(this.bankModel);
    }


}
