import { Variable } from '@angular/compiler/src/render3/r3_ast';
import { Component, OnInit } from '@angular/core';
import { LoginServiceService } from '../login-service.service';
import { User } from '../model/user';
import { Router } from "@angular/router";
import { LOCAL_STORAGE, WebStorageService } from 'angular-webstorage-service';
import { Injectable, Inject } from "@angular/core";
import { BehaviorSubject, Observable } from 'rxjs';


@Component({
    selector: 'app-loginpage',
    templateUrl: './loginpage.component.html',
    styleUrls: ['./loginpage.component.css']
})
export class LoginpageComponent implements OnInit {


    testarr: User[] = [];
    testarr2: User[] = [];
    testdata: any[];

    constructor(private loginService: LoginServiceService,
        private myrouter: Router,
        // @Inject(LOCAL_STORAGE) private storage: WebStorageService,
    ) {

    }

    ngOnInit(): void {
        this.getAll();
        this.checkLogin('', '');
    }

    getAll(): void {
        this.loginService.getUser()
            .subscribe(
                (data: any[]) => (this.testarr = data)
            )
    }

    checkLogin(email: string, password: string): boolean {

        // fetch data down to array testarr2
        this.loginService.getUser()
            .subscribe(
                (data: any[]) => (this.testarr2 = data)
            )

        // check if user input email/pass are correct and return a bool
        for (var i = 0; i < this.testarr2.length; i++) {
            var temp = false;

            if (this.testarr2[i].user_email === email && this.testarr2[i].user_password === password) {
                temp = true;
                this.loginService.storeLoginSession(this.testarr2[i].user_id,
                    this.testarr2[i].user_name,
                    this.testarr2[i].user_email,
                    this.testarr2[i].user_password,
                    this.testarr2[i].is_login,
                    this.testarr2[i].user_role);
                if (this.testarr2[i].user_role === 'admin') {
                    this.myrouter.navigate(['profile-page']);
                }
                else {
                    // redirect to normal user
                    this.myrouter.navigate(['profile-page']);
                }
                i = this.testarr2.length - 1;

            }
            else {
                temp = false;
            }

        }


        console.log(temp);
        return temp;
    }



}
