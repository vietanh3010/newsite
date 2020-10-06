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
export class AdminService {
    adminAPI = 'https://5f632f38363f0000162d8476.mockapi.io/admins';
    constructor(private http: HttpClient) { }
    getAdmin(): Observable<Admin[]> {
        return this.http.get<Admin[]>(this.adminAPI);
    }
    deleteAdmin(id: any): Observable<{}> {
        const url = this.adminAPI + '/' + id.toString();
        return this.http.delete(url, httpOptions);
    }
    updateAdmin(admin: Admin): Observable<Admin> {
        const url = this.adminAPI + '/' + admin.admin_id.toString();
        return this.http.put<Admin>(url, admin, httpOptions);
    }
    addAdmin(admin: Admin): Observable<Admin> {
        return this.http.post<Admin>(this.adminAPI, admin, httpOptions);
    }
}
