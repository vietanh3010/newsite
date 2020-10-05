import { AfterViewInit, Component, OnInit, ValueProvider, ViewChild } from '@angular/core';
import { LoginServiceService } from '../login-service.service';
import { OrderService } from '../service/order.service';
import { User } from '../model/user';
import { Neworder } from '../model/neworder';
import { Product } from '../model/product';
import { MyToast } from '../model/Mytoast';
import { LOCAL_STORAGE, WebStorageService } from 'angular-webstorage-service';
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
import { timeStamp } from 'console';
import { borderTopRightRadius } from 'html2canvas/dist/types/css/property-descriptors/border-radius';

@Component({
    selector: 'app-profilepage',
    templateUrl: './profilepage.component.html',
    styleUrls: ['./profilepage.component.css']
})

export class ProfilepageComponent implements OnInit {

    sortType: string;
    sortReverse: false;

    infoarr: User[] = [];

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
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private logoutService: LoginServiceService,
        private getalluserService: LoginServiceService,
        private getallproductService: LoginServiceService,
        private getallneworderService: NeworderService,
        private routeLogout: Router,
    ) {
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

        this.pagi_count();
        this.pagi_user(1);
        this.pagi_product(1);
        this.pagi_order(1);
    }
    enableBordercolor(): void {
        this.toggle = !this.toggle;
        this.status = this.toggle ? 'Enable' : 'Disable';
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
        if (this.chooseOrder === 'total_price' || this.chooseOrder === 'total_paid' || this.chooseOrder === 'total_unpaid') {
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
        this.getalluserService.getUser()
            .subscribe(
                (data: any[]) => (this.alluser = data, this.USER_TEMP = data)
            );
    }
    // get list products
    getAllproduct(): void {
        this.getallproductService.getProduct()
            .subscribe(
                (data: any[]) => (this.allproduct = data)
            );
    }
    // get list orders
    getAllneworder(): void {
        this.getallneworderService.getNeworder().subscribe(
            (data: any[]) => (this.allneworder = data)
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
    updateUser(u: User, name: string, email: string, password: string, role: string): void {
        if (name !== '') { u.user_name = name; }
        if (email !== '') { u.user_email = email; }
        if (password !== '') { u.user_password = password; }
        if (role !== '') { u.user_role = role; }

        this.getalluserService.updateUser(u).subscribe(
            response => { console.log(response); },
            error => { console.log(error); }
        );
        this.make_error('success', 'User ' + u.user_id + 'updated successfully.');
    }
    updateProduct(p: Product, productName: string, productPrice: number, productImg: string): void {
        if (productName !== '') { p.product_name = productName; }
        if (productPrice.toString() !== '') { p.product_price = productPrice; }
        if (productImg !== '') { p.product_img = productImg; }
        this.getallproductService.updateProduct(p).subscribe();
        this.make_error('success', 'Product' + p.product_id + 'updated successfully.');
    }

    updateNeworder(o: Neworder, price: number, paid: number, unpaid: number): void {
        if (price.toString() !== '') { o.total_price = price; }
        if (paid.toString() !== '') { o.total_paid = paid; }
        if (unpaid.toString() !== '') { o.total_unpaid = unpaid; }
        o.updated_at = Date();
        this.getallneworderService.updateNeworder(o).subscribe();
        this.make_error('success', 'Order' + o.order_id + 'updated successfully.');
    }

    // delete
    removeUser(user: User): void {
        const index = this.alluser.indexOf(user);
        this.alluser.splice(index, 1);
        this.USER_TEMP.splice(this.USER_TEMP.indexOf(user), 1);
        this.getalluserService.deleteUser(user.user_id).subscribe();
        this.make_error('success', 'User ' + user.user_id + ' deleted successfully.');
    }
    removeProduct(product: Product): void {
        const index = this.allproduct.indexOf(product);
        this.allproduct.splice(index, 1);
        this.PRODUCT_TEMP.splice(this.PRODUCT_TEMP.indexOf(product), 1);
        this.getallproductService.deleteProduct(product.product_id).subscribe();
        this.make_error('success', 'Product' + product.product_id + ' deleted successfully.');
    }
    removeNeworder(order: Neworder): void {
        const index = this.allneworder.indexOf(order);
        this.allneworder.splice(index, 1);
        this.ORDER_TEMP.splice(this.ORDER_TEMP.indexOf(order), 1);
        this.getallneworderService.deleteNeworder(order.order_id).subscribe();
        this.make_error('success', 'Order' + order.order_id + ' deleted successfully.');
    }
    // add
    addnewUser(user_name: string, user_email: string, user_password: string, user_role: string): void {
        if (user_name === '' || user_email === '' || user_password === '' || user_role === '') {
            this.make_error('warning', 'Input cannot be empty!');
        }
        else if ((this.alluser.filter(a => a.user_name === user_name) as User[]).length === 1) {
            this.make_error('danger', 'This username is taken!');
        }
        else if ((this.alluser.filter(a => a.user_email === user_email) as User[]).length === 1) {
            this.make_error('danger', 'This email is taken!');
        }
        else {
            const user_id = 'myuid';
            const is_login = false;
            const unknUser: unknown = { user_id, user_name, user_email, user_password, is_login, user_role };
            const newUser: User = unknUser as User;
            this.getalluserService.addUser(newUser).subscribe();
            this.make_error('success', 'New user is added successfully!');
        }

    }
    addnewProduct(product_name: string, product_price: number, product_img: string): void {
        const product_id = 'mypID';
        const product_stock = 0;
        const product_bought = 0;
        const product_created_at: string = Date();
        const product_updated_at: string = Date();
        const unknProduct: unknown =
            { product_id, product_name, product_price, product_img, product_stock, product_bought, product_created_at, product_updated_at };
        const newProduct: Product = unknProduct as Product;
        this.getallproductService.addProduct(newProduct).subscribe();
    }
    addnewOrder(total_price: number, customer: object, products: Cart[]): void {
        const order_id = 'myoID';
        const total_paid = 0;
        const total_unpaid = total_price;
        const created_at: string = Date();
        const updated_at: string = Date();
        const unknOrder: unknown = { order_id, total_price, total_paid, total_unpaid, customer, products, created_at, updated_at };
        const newOrder: Neworder = unknOrder as Neworder;
        this.getallneworderService.addNeworder(newOrder).subscribe();
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
    setOrder(userid: any): void {
        console.log(this.neworder);
        console.log(userid);

        const totalprice = this.getTotalprice(this.neworder);
        const customerObj: User = this.getUserbyid(userid);
        const cartArr = this.getArrproduct(this.neworder);

        this.addnewOrder(totalprice, customerObj, cartArr);
        this.modaldismiss();
    }
    getArrproduct(neworderarr: any[]): Cart[] {
        const tempCartarr: Cart[] = [];

        // tslint:disable-next-line: no-var-keyword
        for (var i = 0; i < neworderarr.length; i++) {
            tempCartarr.push(
                {
                    product_id: neworderarr[i].product_id,
                    product_quantity: neworderarr[i].product_quantity
                }
            );
        }
        return tempCartarr;
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
                }
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
        this.alluser = await this.getalluserService.getUser().toPromise();
        const u = Math.ceil(this.alluser.length / 10);
        for (var i = 0; i < u; i++) {
            this.PAGI_COUNT_USER.push((i + 1));
        }

        this.allproduct = await this.getallproductService.getProduct().toPromise();
        const p = Math.ceil(this.allproduct.length / 10);
        for (var i = 0; i < p; i++) {
            this.PAGI_COUNT_PRODUCT.push((i + 1));
        }

        this.allneworder = await this.getallneworderService.getNeworder().toPromise();
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
