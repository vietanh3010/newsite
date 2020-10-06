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
export class UserService {
    userAPI = 'https://5f632f38363f0000162d8476.mockapi.io/users';
    constructor(private http: HttpClient) { }

    getUser(): Observable<User[]> {
        return this.http.get<User[]>(this.userAPI);
    }
    deleteUser(id: any): Observable<{}> {
        // const url = `${this.userAPI}/id=${id}`;
        const url = this.userAPI + '/' + id.toString();
        return this.http.delete(url, httpOptions);
    }
    updateUser(user: User): Observable<User> {
        const url = this.userAPI + '/' + user.user_id.toString();
        return this.http.put<User>(url, user, httpOptions);
    }
    addUser(user: User): Observable<User> {
        return this.http.post<User>(this.userAPI, user, httpOptions);
    }
}
