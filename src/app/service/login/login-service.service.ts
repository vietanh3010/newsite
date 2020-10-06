import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import { User } from '../../model/user';
import { Product } from '../../model/product';
import { Admin } from '../../model/admin';
import { BehaviorSubject, Observable } from 'rxjs';


const httpOptions = {
    headers: new HttpHeaders({
    })
};

@Injectable({
    providedIn: 'root'
})
export class LoginServiceService {
    private currentAdminSubject: BehaviorSubject<Admin>;
    public currentAdmin: Observable<Admin>;

    constructor(private http: HttpClient) {
        this.currentAdminSubject = new BehaviorSubject<Admin>(JSON.parse(localStorage.getItem('currentAdmin')));
        this.currentAdmin = this.currentAdminSubject.asObservable();
    }
    public get currentAdminValue(): Admin {
        return this.currentAdminSubject.value;
    }

    // store the logged email to localstorage
    storeLoginSession(
        sessionAdminID: string, sessionAdminName: string, sessionAdminEmail: string,
        sessionAdminPassword: string, sessionCreatedAt: Date, sessionUpdatedAt: Date,
        sessionAdminRole: string, sessionAdminInfo: string, sessionAdminHashID: string): void {
        const tempAdmin = {
            admin_id: sessionAdminID,
            admin_name: sessionAdminName,
            admin_email: sessionAdminEmail,
            admin_password: sessionAdminPassword,
            created_at: sessionCreatedAt,
            updated_at: sessionUpdatedAt,
            admin_role: sessionAdminRole,
            admin_info: sessionAdminInfo,
            admin_hash_id: sessionAdminHashID,
        };

        localStorage.setItem('currentAdmin', JSON.stringify(tempAdmin));
        this.currentAdminSubject.next(tempAdmin);
        console.log(localStorage);
        console.log(this.currentAdminValue);
    }

    logout(): void {
        localStorage.removeItem('currentAdmin');
        this.currentAdminSubject.next(null);
        console.log(localStorage);
    }


}
