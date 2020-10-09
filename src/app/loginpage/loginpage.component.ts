import { Variable } from '@angular/compiler/src/render3/r3_ast';
import { Component, OnInit } from '@angular/core';
import { LoginServiceService } from '../service/login/login-service.service';
import { AdminService } from '../service/admin/admin.service';

import { User } from '../model/user';
import { Admin } from '../model/admin';
import { Router } from '@angular/router';
import { MyToast } from '../model/Mytoast';

import { LOCAL_STORAGE, WebStorageService } from 'angular-webstorage-service';
import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';


@Component({
    selector: 'app-loginpage',
    templateUrl: './loginpage.component.html',
    styleUrls: ['./loginpage.component.css']
})
export class LoginpageComponent implements OnInit {
    testarr: Admin[] = [];
    adminList: Admin[] = [];
    err: MyToast[] = [];
    constructor(
        private loginService: LoginServiceService,
        private myrouter: Router,
        private adminService: AdminService,
    ) {
    }
    ngOnInit(): void {
        this.getAll();
        this.checkLogin('', '');
    }
    getAll(): void {
        this.adminService.getAdmin()
            .subscribe(
                (data: any[]) => (this.testarr = data)
            );
    }

    checkLogin(email: string, password: string): boolean {
        // fetch data down to array adminList
        this.adminService.getAdmin()
            .subscribe(
                (data: any[]) => (this.adminList = data)
            );
        // check if user input email/pass are correct and return a bool
        for (var i = 0; i < this.adminList.length; i++) {
            var temp = undefined;
            if (this.adminList[i].admin_email === email && this.adminList[i].admin_password === password) {
                temp = true;
                this.loginService.storeLoginSession(
                    this.adminList[i].admin_id,
                    this.adminList[i].admin_name,
                    this.adminList[i].admin_email,
                    this.adminList[i].admin_password,
                    this.adminList[i].created_at,
                    this.adminList[i].updated_at,
                    this.adminList[i].admin_role,
                    this.adminList[i].admin_role,
                    this.adminList[i].admin_hash_id,
                );
                if (this.adminList[i].admin_role === 'admin') {
                    this.myrouter.navigate(['profile-page']);
                }
                else {
                    // redirect to normal user
                    this.myrouter.navigate(['sale-page']);
                }
                i = this.adminList.length - 1;
                this.make_error('success', 'Login successfully.')
            }
            else {

                temp = false;
            }

        }

        if (temp === false) {
            this.make_error('warning', 'Incorrect email or password!');
        }
        console.log(temp);
        return temp;
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
