import { AfterViewInit, Component, OnInit, ValueProvider, ViewChild } from '@angular/core';
import { LoginServiceService } from '../service/login/login-service.service';
import { AdminService } from '../service/admin/admin.service';
import { UserService } from '../service/user/user.service';
import { ProductService } from '../service/product/product.service';
import { NeworderService } from '../service/neworder/neworder.service';
import { ExcelService } from '../service/excel/excel.service';

import { Admin } from '../model/admin';
import { User } from '../model/user';
import { Product } from '../model/product';
import { Neworder } from '../model/neworder';
import { MyToast } from '../model/Mytoast';

import { BehaviorSubject, Observable } from 'rxjs';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Md5 } from 'ts-md5';
import { string } from 'src/assets/plugins/jszip/jszip';
import { create } from 'domain';
import { filter } from 'src/assets/build/npm/Plugins';
import { data } from 'jquery';


@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

    infoarr: Admin[] = [];
    err: MyToast[] = [];

    allUser: User[] = [];
    userSort: boolean = undefined;
    PAGI_COUNT_USER: number[] = [];
    searchUser;
    USER_TEMP: User[] = [];
    chooseUser = '';

    allneworder: Neworder[] = [];

    private currentAdminSubject: BehaviorSubject<Admin>;
    public currentAdmin: Observable<Admin>;

    constructor(
        private logoutService: LoginServiceService,
        private getAdminService: AdminService,
        private getUserService: UserService,
        private getProductService: ProductService,
        private getNeworderService: NeworderService,
        private routeLogout: Router,
        private getExcelService: ExcelService,
    ) {
        this.currentAdminSubject = new BehaviorSubject<Admin>(JSON.parse(localStorage.getItem('currentAdmin')));
        this.currentAdmin = this.currentAdminSubject.asObservable();
    }

    ngOnInit(): void {
        this.infoarr.push(JSON.parse(localStorage.getItem('currentAdmin')));
        this.getallUser();
        this.getallNeworder();
        this.pagi_count();
        this.pagi_user(1);
    }

    getallUser(): void {
        this.getUserService.getUser()
            .subscribe(
                (data: any[]) => (this.allUser = data, this.USER_TEMP = data)
            );
    }
    getallNeworder(): void {
        this.getNeworderService.getNeworder().subscribe(
            (dataO: any[]) => (this.allneworder = dataO)
        );
    }
    removeUser(user: User): void {
        const index = this.allUser.indexOf(user);
        this.allUser.splice(index, 1);
        this.USER_TEMP.splice(this.USER_TEMP.indexOf(user), 1);
        this.getUserService.deleteUser(user.user_id).subscribe();
        this.make_error('success', 'User ' + user.user_id + ' deleted successfully.');
    }

    updateUser(
        u: User, name: string, password: string, telephone: string, address: string,
        email: string, role: string, dob: Date, gender: string, info: string): void {
        if (name !== '') { u.user_name = name; }
        if (password !== '') { u.user_password = password; }
        if (address !== '') { u.user_address.push(address); }
        if (role !== '') { u.user_role = role; }

        if (dob !== null) { u.user_dob = new Date(Number(dob) * 1000); }
        if (gender !== '') { u.user_gender = gender; }
        if (info !== '') { u.additional_info = info; }

        if (email !== '' || telephone !== '') {
            if (this.allUser.filter(a => a.user_email === email).length > 0) {
                this.make_error('danger', 'This email has been registered!');
            }
            else if (this.allUser.filter(a => a.user_telephone === telephone).length > 0) {
                this.make_error('danger', 'This telephone has been registered!');
            }
            else {
                if (email !== '') { u.user_email = email; }
                if (telephone !== '') { u.user_telephone = telephone; }
                this.getUserService.updateUser(u).subscribe(
                    response => { console.log(response); },
                    error => { console.log(error); }
                );
                this.make_error('success', 'User ' + u.user_id + ' updated successfully.');
            }
        }

    }

    addNewOrderUser(
        name: string, id: string, telephone: string,
        address: string, email: string, role: string,
        dob: Date, gender: string, info: string): void {

        const u = this.allUser.filter(x => x.user_hash_id === id) as User[];
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
                if (this.allUser.filter(a => a.user_email === email).length > 0) {
                    this.make_error('danger', 'This email has been registered!');
                }
                else if (this.allUser.filter(a => a.user_telephone === telephone).length > 0) {
                    this.make_error('danger', 'This telephone has been registered!');
                }
                else {
                    if (telephone !== '') { existUser.user_telephone = telephone; }
                    if (email !== '') { existUser.user_email = email; }

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
                this.allUser.push(newUser);
                this.make_error('success', 'No user found with ID provided. New user is added successfully!');
            }

        }
    }
    sortUser(property: any): void {
        this.chooseUser = property;
        if (this.chooseUser === 'user_id') {
            if (this.userSort) {
                this.allUser.sort((a, b) => parseFloat(a[property]) < parseFloat(b[property]) ? -1 : 1);
                this.userSort = false;
            }
            else {
                this.allUser.sort((a, b) => parseFloat(a[property]) > parseFloat(b[property]) ? -1 : 1);
                this.userSort = true;
            }
        }
        else {
            if (this.userSort) {
                this.allUser.sort((a, b) => String(a[property]) < String(b[property]) ? -1 : 1);
                this.userSort = false;
            }
            else {
                this.allUser.sort((a, b) => String(a[property]) > String(b[property]) ? -1 : 1);
                this.userSort = true;
            }
        }
        this.pagi_user(1);
    }

    pagi_user(a: number): void {
        this.USER_TEMP = this.allUser;
        this.USER_TEMP = this.allUser.filter(an => this.allUser.indexOf(an) < (a * 10) && this.allUser.indexOf(an) >= (a - 1) * 10);
    }
    async pagi_count(): Promise<void> {
        this.allUser = await this.getUserService.getUser().toPromise();
        const u = Math.ceil(this.allUser.length / 10);
        for (var i = 0; i < u; i++) {
            this.PAGI_COUNT_USER.push((i + 1));
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
