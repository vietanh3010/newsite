import { Variable } from '@angular/compiler/src/render3/r3_ast';
import { Component, OnInit } from '@angular/core';
import { LoginServiceService } from '../service/login/login-service.service';
import { AdminService } from '../service/admin/admin.service';

import { User } from '../model/user';
import { Admin } from '../model/admin';
import { Router } from '@angular/router';

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
            var temp = false;
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
                    this.myrouter.navigate(['profile-page']);
                }
                i = this.adminList.length - 1;

            }
            else {
                temp = false;
            }

        }


        console.log(temp);
        return temp;
    }



}
