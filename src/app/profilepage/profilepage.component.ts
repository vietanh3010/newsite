import { AfterViewInit, Component, OnInit, ValueProvider, ViewChild } from '@angular/core';
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
import { userInfo } from 'os';
import { stringify } from 'querystring';
import { timeStamp } from 'console';
import { borderTopRightRadius } from 'html2canvas/dist/types/css/property-descriptors/border-radius';
import { Md5 } from 'ts-md5';

@Component({
    selector: 'app-profilepage',
    templateUrl: './profilepage.component.html',
    styleUrls: ['./profilepage.component.css']
})

export class ProfilepageComponent implements OnInit {

    sortType: string;
    sortReverse: false;

    infoarr: Admin[] = [];

    alluser: User[] = [];
    allproduct: Product[] = [];
    allneworder: Neworder[] = [];
    searchUser;
    searchProduct;
    searchOrder;
    test: any[];
    userSort: boolean = undefined;
    productSort: boolean = undefined;
    orderSort: boolean = undefined;

    PAGI_COUNT_USER: number[] = [];
    PAGI_COUNT_PRODUCT: number[] = [];
    PAGI_COUNT_ORDER: number[] = [];

    USER_TEMP: User[] = [];
    PRODUCT_TEMP: Product[] = [];
    ORDER_TEMP: Neworder[] = [];

    err: MyToast[] = [];
    pa;
    neworder: any[] = [{
        id: 0,
        product_id: '',
        product_quantity: '',
    }];

    chooseUser = '';
    chooseProduct = '';
    chooseOrder = '';

    selectedProduct;

    toggle = true;
    status = 'Enable';
    private currentAdminSubject: BehaviorSubject<Admin>;
    public currentAdmin: Observable<Admin>;

    constructor(
        private logoutService: LoginServiceService,
        private getAdminService: AdminService,
        private getUserService: UserService,
        private getProductService: ProductService,
        private getNeworderService: NeworderService,
        private routeLogout: Router,
    ) {
        this.currentAdminSubject = new BehaviorSubject<Admin>(JSON.parse(localStorage.getItem('currentAdmin')));
        this.currentAdmin = this.currentAdminSubject.asObservable();
    }

    ngOnInit(): void {
        this.infoarr.push(JSON.parse(localStorage.getItem('currentAdmin')));

        this.getAll();
        this.getAllproduct();
        this.getAllneworder();
        console.log(this.currentAdminSubject.value);

        this.pagi_count();
        this.pagi_order(1);
    }
    updateOrderUser(o: Neworder, name: string, tel: string, email: string, status: string, address: string, role: string): void {
        if (name !== '') { o.customer.user_name = name; }
        if (tel !== '') { o.customer.user_telephone = tel; }
        if (email !== '') { o.customer.user_email = email; }
        if (status !== '') { o.order_status.push(status); }
        if (address !== '') { o.order_address = address; }
        if (role !== '') { o.customer.user_role = role; }

        this.getNeworderService.updateNeworder(o).subscribe();
        this.make_error('success', 'Order info updated successfully.')
    }
    sortUser(property: any): void {
        this.chooseUser = property;
        if (this.chooseUser === 'user_id') {
            if (this.userSort) {
                this.alluser.sort((a, b) => parseFloat(a[property]) < parseFloat(b[property]) ? -1 : 1);
                this.userSort = false;
            }
            else {
                this.alluser.sort((a, b) => parseFloat(a[property]) > parseFloat(b[property]) ? -1 : 1);
                this.userSort = true;
            }
        }
        else {
            if (this.userSort) {
                this.alluser.sort((a, b) => String(a[property]) < String(b[property]) ? -1 : 1);
                this.userSort = false;
            }
            else {
                this.alluser.sort((a, b) => String(a[property]) > String(b[property]) ? -1 : 1);
                this.userSort = true;
            }
        }
        this.pagi_user(1);
    }

    sortProduct(property: any): void {
        this.chooseProduct = property;
        if (this.chooseProduct === 'product_id' ||
            this.chooseProduct === 'product_price' ||
            this.chooseProduct === 'product_stock' ||
            this.chooseProduct === 'product_bought') {
            if (this.productSort) {
                this.allproduct.sort((a, b) => parseFloat(a[property]) < parseFloat(b[property]) ? -1 : 1);
                this.productSort = false;
            }
            else {
                this.allproduct.sort((a, b) => parseFloat(a[property]) > parseFloat(b[property]) ? -1 : 1);
                this.productSort = true;
            }
        }
        else {
            if (this.productSort) {
                this.allproduct.sort((a, b) => a[property].toLowerCase() < b[property].toLowerCase() ? -1 : 1);
                this.productSort = false;
            }
            else {
                this.allproduct.sort((a, b) => a[property].toLowerCase() > b[property].toLowerCase() ? -1 : 1);
                this.productSort = true;
            }
        }
        this.pagi_product(1);
    }

    sortOrder(property: any): void {
        this.chooseOrder = property;
        if (this.chooseOrder === 'order_subtotal' || this.chooseOrder === 'order_discount' || this.chooseOrder === 'order_total') {
            if (this.orderSort) {
                this.allneworder.sort((a, b) => parseFloat(a[property]) < parseFloat(b[property]) ? -1 : 1);
                this.orderSort = false;
            }
            else {
                this.allneworder.sort((a, b) => parseFloat(a[property]) > parseFloat(b[property]) ? -1 : 1);
                this.orderSort = true;
            }
        }
        else {
            if (this.orderSort) {
                this.allneworder.sort((a, b) => a[property].toLowerCase() < b[property].toLowerCase() ? -1 : 1);
                this.orderSort = false;
            }
            else {
                this.allneworder.sort((a, b) => a[property].toLowerCase() > b[property].toLowerCase() ? -1 : 1);
                this.orderSort = true;
            }
        }
        this.pagi_order(1);
    }
    // get list users
    getAll(): void {
        this.getUserService.getUser()
            .subscribe(
                (data: any[]) => (this.alluser = data, this.USER_TEMP = data)
            );
    }
    // get list products
    getAllproduct(): void {
        this.getProductService.getProduct()
            .subscribe(
                (data: any[]) => (this.allproduct = data)
            );
    }
    // get list orders
    getAllneworder(): void {
        this.getNeworderService.getNeworder().subscribe(
            (data: any[]) => (this.allneworder = data, this.ORDER_TEMP = data)
        );
    }
    // async getAllneworder() {
    //  this.allneworder = await this.getallneworderService.getNeworder().toPromise();
    // }
    // get all orders of the current user
    public clickLogout(): void {
        this.logoutService.logout();
        this.routeLogout.navigate(['login-page']);
    }
    // update
    updateUser(
        u: User, name: string, password: string, telephone: string, address: string,
        email: string, role: string, dob: Date, gender: string, info: string): void {
        if (name !== '') { u.user_name = name; }
        if (password !== '') { u.user_password = password; }
        if (address !== '') { u.user_address.push(address); }
        if (role !== '') { u.user_role = role; }

        if (dob !== null) { u.user_dob = dob; }
        if (gender !== '') { u.user_gender = gender; }
        if (info !== '') { u.additional_info = info; }

        if (email !== '' || telephone !== '') {
            if (this.alluser.filter(a => a.user_email === email).length > 0) {
                this.make_error('danger', 'This email has been registered!');
            }
            else if (this.alluser.filter(a => a.user_telephone === telephone).length > 0) {
                this.make_error('danger', 'This telephone has been registered!');
            }
            else {
                if (email !== '') { u.user_email = email; }
                if (telephone !== '') { u.user_telephone = telephone; }
                this.getUserService.updateUser(u).subscribe(
                    response => { console.log(response); },
                    error => { console.log(error); }
                );
                this.make_error('success', 'User ' + u.user_id + 'updated successfully.');
            }
        }

    }
    updateProduct(p: Product, productName: string, productPrice: number, productImg: string): void {
        if (productName !== '') { p.product_name = productName; }
        if (productPrice.toString() !== '') { p.product_price = productPrice; }
        if (productImg !== '') { p.product_img = productImg; }
        this.getProductService.updateProduct(p).subscribe();
        this.make_error('success', 'Product' + p.product_id + 'updated successfully.');
    }

    updateNeworder(o: Neworder, subtotal: number, discount: number, total: number): void {
        if (subtotal.toString() !== '') { o.order_subtotal = subtotal; }
        if (discount.toString() !== '') { o.order_discount = discount; }
        if (total.toString() !== '') { o.order_total = total; }
        o.updated_at = Date();
        this.getNeworderService.updateNeworder(o).subscribe();
        this.make_error('success', 'Order' + o.order_id + 'updated successfully.');
    }

    // delete
    removeUser(user: User): void {
        const index = this.alluser.indexOf(user);
        this.alluser.splice(index, 1);
        this.USER_TEMP.splice(this.USER_TEMP.indexOf(user), 1);
        this.getUserService.deleteUser(user.user_id).subscribe();
        this.make_error('success', 'User ' + user.user_id + ' deleted successfully.');
    }
    removeProduct(product: Product): void {
        const index = this.allproduct.indexOf(product);
        this.allproduct.splice(index, 1);
        this.PRODUCT_TEMP.splice(this.PRODUCT_TEMP.indexOf(product), 1);
        this.getProductService.deleteProduct(product.product_id).subscribe();
        this.make_error('success', 'Product' + product.product_id + ' deleted successfully.');
    }
    removeNeworder(order: Neworder): void {
        const index = this.allneworder.indexOf(order);
        this.allneworder.splice(index, 1);
        this.ORDER_TEMP.splice(this.ORDER_TEMP.indexOf(order), 1);
        this.getNeworderService.deleteNeworder(order.order_id).subscribe();
        this.make_error('success', 'Order' + order.order_id + ' deleted successfully.');
    }
    // add
    addnewUser(userName: string, userEmail: string, userPassword: string, userRole: string): void {
        if (userName === '' || userEmail === '' || userPassword === '' || userRole === '') {
            this.make_error('warning', 'Input cannot be empty!');
        }
        else if ((this.alluser.filter(a => a.user_name === userName) as User[]).length === 1) {
            this.make_error('danger', 'This username is taken!');
        }
        else if ((this.alluser.filter(a => a.user_email === userEmail) as User[]).length === 1) {
            this.make_error('danger', 'This email is taken!');
        }
        else {
            const userId = 'myuid';
            const isLogin = false;
            const createAt = Date();
            const updatedAt = Date();
            const md5User = new Md5();
            const userHashID = md5User.appendStr(userId + userEmail + createAt).end().toString();
            const userImg = '';
            const userTelephone = '';
            const userDob = null;
            const userGender = '';
            const userAddress = [];
            const userTag = [];
            const additionalInfo = '';

            const unknUser: unknown = {
                userId, userName, userEmail, userPassword, isLogin, userRole, userHashID, createAt,
                updatedAt, userImg, userTelephone, userDob, userGender, userAddress, userTag, additionalInfo
            };
            const newUser: User = unknUser as User;
            this.getUserService.addUser(newUser).subscribe();
            this.make_error('success', 'New user is added successfully!');
        }

    }
    addnewProduct(prName: string, prPrice: number, prtImg: string): void {
        const productId = 'mypID';
        const productPrice = prPrice;
        const productStock = 0;
        const productBought = 0;
        const createdAt = Date();
        const updatedAt = Date();
        const md5Product = new Md5();
        const productHashID = md5Product.appendStr(productId + prName + createdAt).end().toString();
        const productPrimeCost = 0;
        const productCategory = '';
        const productWeight = 0;
        const productDesscription = '';
        const productBranch = '';
        const productTag = [];
        const additionalInfo = '';
        const unknProduct: unknown =
        {
            productId, prName, productPrice, prtImg, productStock, productBought, createdAt, updatedAt, productHashID,
            productPrimeCost, productCategory, productWeight, productDesscription, productBranch, productTag, additionalInfo
        };
        const newProduct: Product = unknProduct as Product;
        this.getProductService.addProduct(newProduct).subscribe();
    }


    addinput(): void {
        this.neworder.push({
            id: this.neworder.length + 1,
            product_id: '',
            product_quantity: '',
        });
        console.log(this.neworder);
    }

    removethis(q: number): void {
        this.neworder.splice(q, 1);
    }
    modaldismiss(): void {
        this.neworder = [{
            id: 0,
            product_id: '',
            product_quantity: '',
        }];
    }

    // get totalprice from input array
    getTotalprice(p: any[]): number {
        let total = 0;
        let tempObj: Product;

        for (var i = 0; i < p.length; i++) {
            tempObj = this.getProductbyid(p[i].product_id);

            total += ((tempObj.product_price) * (+p[i].product_quantity));
        }
        return total;
    }

    // get user by id, return object user
    getUserbyid(id: any): User {
        let tempUser: User;
        for (var i = 0; i < this.alluser.length; i++) {
            if (this.alluser[i].user_id === id) {
                tempUser = {
                    user_id: this.alluser[i].user_id,
                    user_name: this.alluser[i].user_name,
                    user_email: this.alluser[i].user_email,
                    user_password: this.alluser[i].user_password,
                    is_login: this.alluser[i].is_login,
                    user_role: this.alluser[i].user_role,
                    user_hash_id: this.alluser[i].user_hash_id,
                    created_at: this.alluser[i].created_at,
                    updated_at: this.alluser[i].updated_at,
                    user_img: this.alluser[i].user_img,
                    user_telephone: this.alluser[i].user_telephone,
                    user_dob: this.alluser[i].user_dob,
                    user_gender: this.alluser[i].user_gender,
                    user_address: this.alluser[i].user_address,
                    user_tag: this.alluser[i].user_tag,
                    additional_info: this.alluser[i].additional_info
                };
            }
        }
        return tempUser;
    }
    // get product by id, return object product
    getProductbyid(id: any): Product {
        let tempProduct: Product;

        for (var i = 0; i < this.allproduct.length; i++) {
            if (this.allproduct[i].product_id === id) {
                tempProduct = {
                    product_id: this.allproduct[i].product_id,
                    product_name: this.allproduct[i].product_name,
                    product_price: this.allproduct[i].product_price,
                    product_img: this.allproduct[i].product_img,
                    product_stock: this.allproduct[i].product_stock,
                    product_bought: this.allproduct[i].product_bought,
                    product_created_at: this.allproduct[i].product_created_at,
                    product_updated_at: this.allproduct[i].product_updated_at,
                    product_hash_id: this.allproduct[i].product_hash_id,
                    product_prime_cost: this.allproduct[i].product_prime_cost,
                    product_category: this.allproduct[i].product_category,
                    product_weight: this.allproduct[i].product_weight,
                    product_description: this.allproduct[i].product_description,
                    product_branch: this.allproduct[i].product_branch,
                    product_tag: this.allproduct[i].product_tag,
                    additional_info: this.allproduct[i].additional_info,
                    product_barcode: this.allproduct[i].product_barcode,
                    product_unit: this.allproduct[i].product_unit,
                    product_brand: this.allproduct[i].product_unit,
                };
            }
        }
        return tempProduct;
    }

    pagi_user(a: number): void {
        this.USER_TEMP = this.alluser;
        this.USER_TEMP = this.alluser.filter(an => this.alluser.indexOf(an) < (a * 10) && this.alluser.indexOf(an) >= (a - 1) * 10);
    }

    pagi_product(a: number): void {
        this.PRODUCT_TEMP = this.allproduct;
        this.PRODUCT_TEMP = this.allproduct
            .filter(an => this.allproduct.indexOf(an) < (a * 10) && this.allproduct.indexOf(an) >= (a - 1) * 10);
    }

    pagi_order(a: number): void {
        this.ORDER_TEMP = this.allneworder;
        this.ORDER_TEMP = this.allneworder
            .filter(an => this.allneworder.indexOf(an) < (a * 10) && this.allneworder.indexOf(an) >= (a - 1) * 10);
    }

    async pagi_count(): Promise<void> {
        this.alluser = await this.getUserService.getUser().toPromise();
        const u = Math.ceil(this.alluser.length / 10);
        for (var i = 0; i < u; i++) {
            this.PAGI_COUNT_USER.push((i + 1));
        }

        this.allproduct = await this.getProductService.getProduct().toPromise();
        const p = Math.ceil(this.allproduct.length / 10);
        for (var i = 0; i < p; i++) {
            this.PAGI_COUNT_PRODUCT.push((i + 1));
        }

        this.allneworder = await this.getNeworderService.getNeworder().toPromise();
        const o = Math.ceil(this.allneworder.length / 10);
        for (var i = 0; i < o; i++) {
            this.PAGI_COUNT_ORDER.push((i + 1));
        }

    }

    toast_type(t: string): object {
        if (t === 'danger') {
            return {
                'callout': true,
                'callout-danger ': true,
                'color ': 'red',
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
                'callout': true,
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
}
